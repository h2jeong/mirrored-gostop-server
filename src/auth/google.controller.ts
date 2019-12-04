import * as express from 'express';
import Controller from '../interfaces/controller.interface';
import userModel from '../users/user.model';
import {
  urlGoogle,
  getGoogleAccountFromCode,
} from '../middleware/google.middleware';
import authCtrl from './authentication.controller';
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
    this.router.get(
      `${this.path}/callback`,
      this.getGoogleAuth,
      authCtrl.logIn,
    );
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
      // console.log('무엇이 들어옵니까? googleUser :: ', googleUserInfo);
      const userEmail = googleUserInfo.email;
      try {
        let user = await this.user.findOne({ email: userEmail });
        if (!user) {
          user = await this.user.create({
            name: 'googleUser',
            email: userEmail,
            password: '@googleOauth',
            userCode: 3,
          });
        }
      } catch (error) {
        console.log('gg ctlr :: ', error.message);
        next(new HttpException(500, error.message));
      }
      req.user = { email: userEmail };
      console.log('넘어가나요? ', req.user);
      next();
    } catch (error) {
      console.log('gg catch ::', error.message);
      next(new HttpException(500, error.message));
    }
  };
}

export default GoogleController;
