import * as express from 'express';
import * as jwt from 'jsonwebtoken';
import Controller from '../interfaces/controller.interface';
import userModel from '../users/user.model';
import TokenData from '../interfaces/tokenData.interface';
import {
  urlGoogle,
  getGoogleAccountFromCode,
} from '../middleware/google.middleware';
import HttpException from '../exceptions/HttpException';
import DataInToken from '../interfaces/dataInToken.interface';

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
      const userEmail = googleUserInfo.email;
      try {
        let user = await this.user.findOne({ email: userEmail });
        if (!user) {
          user = await this.user.create({
            name: 'googleUser',
            email: userEmail,
            password: '@googleOauth',
            userCode: 3,
            refreshToken: googleUserInfo.tokens.refresh_token,
          });
        }
        req.user = user;

        const expiresIn = 60 * 60 * 1;
        const secret = process.env.JWT_SECRET;
        const dataInToken: DataInToken = {
          _id: user._id,
        };
        const tokenData: TokenData = {
          token: jwt.sign(dataInToken, secret, { expiresIn }),
          expiresIn: googleUserInfo.tokens.expiry_date,
        };

        console.log('authCtr :: ', user, tokenData);
        const createCookie = `Authorization=${tokenData.token};HttpOnly;Max-Age=${tokenData.expiresIn}`;
        res.setHeader('Set-Cookie', [createCookie]);
      } catch (error) {
        next(new HttpException(500, error.message));
      }

      res.redirect(`http://localhost:5000/users/habits`);
    } catch (error) {
      next(new HttpException(500, error.message));
    }
  };
}

export default GoogleController;
