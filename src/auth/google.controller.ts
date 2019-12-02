import * as express from 'express';
import Controller from '../interfaces/controller.interface';
import userModel from '../users/user.model';
import TokenData from '../interfaces/tokenData.interface';
import {
  urlGoogle,
  getGoogleAccountFromCode,
} from '../middleware/google.middleware';
import HttpException from '../exceptions/HttpException';

class GoogleController implements Controller {
  public path = '/auth';
  public router = express.Router();
  private user = userModel;

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
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
      const createCookie = `Authorization=${tokenData.token};HttpOnly;Max-Age=${tokenData.expiresIn}`;
      res.setHeader('Set-Cookie', [createCookie]);
      res.send(user);
      // res.redirect(this.redirectUrl);
    } catch (error) {
      // console.error(error);
      next(new HttpException(500, error.message));
    }
  };
}

export default GoogleController;
