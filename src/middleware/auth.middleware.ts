import { NextFunction, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import ReqWithUser from '../interfaces/reqWithUser.interface';
import DataInToken from '../interfaces/dataInToken.interface';
import userModel from '../users/user.model';
import WrongTokenException from '../exceptions/WrongTokenException';
import NoTokenException from '../exceptions/NoTokenException';

async function authMiddleware(
  req: ReqWithUser,
  res: Response,
  next: NextFunction,
) {
  const cookies = req.cookies;
  console.log('auth cookie :: ', cookies, cookies.Expires);
  if (cookies && cookies.Authorization) {
    console.log('여기는?', req.body);
    const secret = process.env.JWT_SECRET;
    // If the token is wrong, or it expired, the jwt.verify function throws an error and we need to catch it.
    try {
      const expires = Date.parse(cookies.Expires);
      let date = new Date().toUTCString();
      let now = Date.parse(date);
      console.log(expires - now);

      if (expires - now < 300000) {
        const user = await userModel.findOne({ email: req.body.email });
        console.log('user:: ', user);
        if (user && user.refreshToken) {
          const expiresIn = 60 * 1;
          const secret = process.env.JWT_SECRET;
          const dataInToken: DataInToken = {
            _id: user._id,
          };
          const tokenData = await {
            expiresIn,
            token: jwt.sign(dataInToken, secret, { expiresIn }),
          };
          console.log('getToken :: ', user, tokenData);
          res.setHeader('Set-Cookie', [
            `Authorization=${tokenData.token};HttpOnly;Max-Age=${tokenData.expiresIn}`,
          ]);
        } else {
          next(new NoTokenException());
        }
      } else {
        next(new WrongTokenException());
      }

      const verifyResponse = (await jwt.verify(
        cookies.Authorization,
        secret,
      )) as DataInToken;

      console.log('authMW - user :: ', verifyResponse);
      const id = verifyResponse._id;
      const user = await userModel.findById(id);

      if (user) {
        req.user = user;
        next();
      } else {
        next(new WrongTokenException());
      }
    } catch (error) {
      next(new WrongTokenException());
    }
  } else {
    next(new NoTokenException());
  }
}

export default authMiddleware;
