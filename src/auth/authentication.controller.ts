import * as bcrypt from 'bcrypt';
import * as express from 'express';
import * as jwt from 'jsonwebtoken';
import EmailExistsException from '../exceptions/EmailExistsException';
import NoCredentialsException from '../exceptions/NoCredentialsException';
import validationMiddleware from '../middleware/validation.middleware';
import Controller from '../interfaces/controller.interface';
import LogInDto from './logIn.dto';
import User from '../users/user.interface';
import CreateUserDto from '../users/user.dto';
import userModel from '../users/user.model';
import TokenData from '../interfaces/tokenData.interface';
import DataInToken from '../interfaces/dataInToken.interface';
import {
  urlGoogle,
  getGoogleAccountFromCode,
} from '../middleware/google.middleware';
import HttpException from '../exceptions/HttpException';
import ReqWithUser from '../interfaces/reqWithUser.interface';
import NotFoundException from '../exceptions/NotFoundException';

class AuthenticationController implements Controller {
  public path = '/auth';
  public router = express.Router();
  private user = userModel;
  private redirectUrl = process.env.CLIENT_ADDRESS;

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(
      `${this.path}/signup`,
      validationMiddleware(CreateUserDto),
      this.signUp,
    );
    this.router.post(
      `${this.path}/login`,
      validationMiddleware(LogInDto),
      this.logIn,
    );
    this.router.post(`${this.path}/logout`, this.logOut);

    // google oauth
    this.router.get(`${this.path}/google`, this.getGoogleUrl);
    this.router.get(`${this.path}/callback`, this.getGoogleAuth);
  }
  private getGoogleUrl = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    const url = await urlGoogle();
    res.redirect(url);
  };

  private getGoogleAuth = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    try {
      const { code } = req.query;
      const googleUserInfo = await getGoogleAccountFromCode(code);
      console.log('무엇이 들어옵니까? googleUser :: ', googleUserInfo);

      let user = await this.user.findOne({ email: googleUserInfo.email });
      if (!user) {
        user = await this.user.create({
          name: 'googleUser',
          email: googleUserInfo.email,
          password: '@googleOauth',
          userCode: 3,
          refreshToken: googleUserInfo.tokens.refresh_token,
        });
      }

      const tokenData: TokenData = {
        token: googleUserInfo.tokens.access_token,
        expiresIn: googleUserInfo.tokens.expiry_date,
      };

      console.log('authCtr :: ', user, tokenData);
      res.setHeader('Set-Cookie', [this.createCookie(tokenData)]);
      res.send(user);
      // res.redirect(this.redirectUrl);
    } catch (error) {
      console.error(error);
      next(new HttpException(500, error.message));
    }
  };

  private signUp = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    const userData: CreateUserDto = req.body;
    if (await this.user.findOne({ email: userData.email })) {
      next(new EmailExistsException(userData.email));
    } else {
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      const user = await this.user.create({
        ...userData,
        password: hashedPassword,
      });
      user.password = undefined;

      // jwt
      // const tokenData = await this.createToken(user);
      // res.setHeader('Set-Cookie', [this.createCookie(tokenData)]);
      res.send(user);
    }
  };

  private logIn = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    const logInData: LogInDto = req.body;
    const userData = await this.user.findOne({ email: logInData.email });

    if (userData) {
      const isPasswordMatching = await bcrypt.compare(
        logInData.password,
        userData.password,
      );
      if (isPasswordMatching) {
        userData.password = undefined;

        // jwt
        const refreshId = userData.id + process.env.REFRESH_SECRET;
        // const hashedId = await bcrypt.hash(refreshId, 10);
        // const expiresIn = 60 * 60 * 24;
        const refreshToken = await jwt.sign(
          { uid: refreshId },
          process.env.REFRESH_SECRET,
          { expiresIn: 60 * 60 * 24, algorithm: 'HS256' },
        );

        const user = await this.user.findByIdAndUpdate(
          userData.id,
          { $set: { refreshToken: refreshToken } },
          {
            new: true,
          },
        );

        const tokenData = await this.createToken(user);

        console.log('authCtr :: ', user, tokenData);
        res.setHeader('Set-Cookie', [this.createCookie(tokenData)]);
        res.send(user);
      } else {
        next(new NoCredentialsException());
      }
    } else {
      next(new NoCredentialsException());
    }
  };

  private getToken = async (
    req: ReqWithUser,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    const id = req.user._id;
    const user = await this.user.findById(id);

    if (user && user.refreshToken) {
      const tokenData = await this.createToken(user);
      console.log('authCtr :: ', user, tokenData);
      res.setHeader('Set-Cookie', [this.createCookie(tokenData)]);
      res.send(user);
    } else {
      next(new NotFoundException(id, this.path));
    }
  };

  private createToken(user: User) {
    // console.log('authCtl - createToken :: ', user);
    const expiresIn = 60 * 60 * 1;
    const secret = process.env.JWT_SECRET;
    const dataInToken: DataInToken = {
      _id: user._id,
    };
    return {
      expiresIn,
      token: jwt.sign(dataInToken, secret, { expiresIn }),
    };
  }

  private createCookie(tokenData: TokenData) {
    // console.log('authCtl - createCookie :: ', tokenData);
    return `Authorization=${tokenData.token};HttpOnly;Max-Age=${tokenData.expiresIn}`;
  }

  private logOut = (req: express.Request, res: express.Response) => {
    res.setHeader('Set-cookie', ['Authorization=;Max-age=0']);
    res.send(200);
  };
}

export default AuthenticationController;
