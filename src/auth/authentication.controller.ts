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
        });
      }
      // const dataInToken: DataInToken = {
      //   _id: user._id,
      //   refreshToken: googleUserInfo.tokens.refresh_token,
      // };

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
      const tokenData = await this.createToken(user);
      res.setHeader('Set-Cookie', [this.createCookie(tokenData)]);
      res.send(user);
    }
  };

  private logIn = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    const logInData: LogInDto = req.body;
    const user = await this.user.findOne({ email: logInData.email });
    if (user) {
      const isPasswordMatching = await bcrypt.compare(
        logInData.password,
        user.password,
      );
      if (isPasswordMatching) {
        user.password = undefined;

        // jwt
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

  private async createToken(user: User) {
    // console.log('authCtl - createToken :: ', user);
    const expiresIn = 60 * 60 * 1; // 임시로 늘여 놓음
    const secret = process.env.JWT_SECRET;

    let refreshId = user._id + secret;
    const refresh_token = await bcrypt.hash(refreshId, 10);
    //  let salt = crypto.randomBytes(16).toString('base64');
    //  let hash = crypto.createHmac('sha512', salt).update(refreshId).digest("base64");
    // let token = jwt.sign(user, secret);
    // let refresh_token = b.toString('base64');
    console.log('refresh_token :: ', refresh_token);

    const dataInToken: DataInToken = {
      _id: user._id,
      refreshToken: refresh_token,
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
