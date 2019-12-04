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
import ReqWithUser from '../interfaces/reqWithUser.interface';
import WrongTokenException from '../exceptions/WrongTokenException';
import OverTokenExpiredException from '../exceptions/OverTokenExpiredException';

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
    this.router.post(`${this.path}/refresh`, this.refresh);
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
      res.send(user);
    }
  };

  private logIn = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    const logInData: LogInDto = req.body;
    let userData = await this.user.findOne({ email: logInData.email });

    if (userData) {
      const isPasswordMatching = await bcrypt.compare(
        logInData.password,
        userData.password,
      );
      if (isPasswordMatching) {
        userData.password = undefined;

        // jwt
        const expiresIn = 60 * 60 * 24 * 15;
        const refreshToken = await jwt.sign(
          { uid: userData._id },
          process.env.REFRESH_SECRET,
          { expiresIn },
        );
        const user = await this.user.findByIdAndUpdate(
          userData._id,
          { refreshToken: refreshToken },
          {
            new: true,
          },
        );
        const tokenData = await this.createToken(user);

        res.setHeader('Set-Cookie', [this.createCookie(tokenData)]);
        res.json({ refreshToken: refreshToken });
      } else {
        next(new NoCredentialsException());
      }
    } else {
      next(new NoCredentialsException());
    }
  };

  private createToken(user: User) {
    const expiresIn = 60 * 60 * 24;
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
    return `Authorization=${tokenData.token};HttpOnly;Max-Age=${tokenData.expiresIn}`;
  }

  private logOut = (req: express.Request, res: express.Response) => {
    res.setHeader('Set-cookie', ['Authorization=;Max-age=0']);
    res.send(200);
  };

  // 1. 프론트에 토큰 expiry date 저장, 백엔드에 request할 때마다 만료 날짜의 초과 확인
  // 2. 만료된 경우 refresh token 요청
  // 3. 백엔드는 refresh token 엔드포인트를 만들고 acees-token/refresh-token 모두 보내준다.
  // 4. access-token 으로 필요한 데이터를 얻는다. (만료 날짜 고려하지 말고)
  // 5. refresh-token과 디비의 최신 refresh-token 비교하여 일치하지 않을 경우 유저는 인증되지 않았고 그렇지 않으면 계속 고고
  // 6. 토큰이 유효하면 디비를 쿼리하지 않고 access-token을 새 토큰으로 만들고 아닐 경우 쿼리 하고 access-token을 다시 만든다.

  private refresh = async (
    req: ReqWithUser,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    const refreshToken = req.body.refreshToken;

    // If the token is wrong, or it expired, the jwt.verify function throws an error and we need to catch it.
    try {
      const verifyResponse = await jwt.verify(
        refreshToken,
        process.env.REFRESH_SECRET,
      );
      const uid = JSON.stringify(verifyResponse)
        .split(':')[1]
        .split(',')[0];
      const id = JSON.parse(uid);
      const user = await userModel.findById(id);

      if (user && user.refreshToken === refreshToken) {
        const tokenData = await this.createToken(user);

        res.setHeader('Set-Cookie', [this.createCookie(tokenData)]);
        res.json({ refreshToken: refreshToken });
      } else {
        next(new WrongTokenException());
      }
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        next(new OverTokenExpiredException());
      } else {
        next(new WrongTokenException());
      }
    }
  };
}
export default AuthenticationController;
