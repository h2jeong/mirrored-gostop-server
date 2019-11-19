import * as bcrypt from 'bcrypt';
import * as express from 'express';
import * as jwt from 'jsonwebtoken';
import Controller from '../interfaces/controller.interface';
import userModel from '../users/user.model';
import CreateUserDto from '../users/user.dto';
import EmailExistsException from '../exceptions/EmailExistsException';
import LogInDto from './logIn.dto';
import NoCredentialsException from '../exceptions/NoCredentialsException';
import validationMiddleware from '../middleware/validation.middleware';
import User from '../users/user.interface';
import TokenData from '../interfaces/tokenData.interface';
import DataInToken from '../interfaces/dataInToken.interface';

class AuthenticationController implements Controller {
  public path = '/auth';
  public router = express.Router();
  private user = userModel;

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
  }

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
      const tokenData = this.createToken(user);
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
        const tokenData = this.createToken(user);
        express.response.setHeader('Set-Cookie', [
          this.createCookie(tokenData),
        ]);
        res.send(user);
      } else {
        next(new NoCredentialsException());
      }
    } else {
      next(new NoCredentialsException());
    }
  };

  private logOut = () => {};

  private createToken(user: User): TokenData {
    const expiresIn = 60 * 60;
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
    return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn}`;
  }
}

export default AuthenticationController;
