import { NextFunction, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import ReqWithUser from '../interfaces/reqWithUser.interface';
import DataInToken from '../interfaces/dataInToken.interface';
import userModel from '../users/user.model';
import WrongTokenException from '../exceptions/WrongTokenException';
import NoTokenException from '../exceptions/NoTokenException';
import NotAuthorizedJWTException from '../exceptions/NotAuthorizedJWTException';

async function authMiddleware(
  req: ReqWithUser,
  res: Response,
  next: NextFunction,
) {
  const cookies = req.cookies;

  if (cookies && cookies.Authorization) {
    const secret = process.env.JWT_SECRET;
    // If the token is wrong, or it expired, the jwt.verify function throws an error and we need to catch it.
    try {
      const verifyResponse = (await jwt.verify(
        cookies.Authorization,
        secret,
      )) as DataInToken;

      console.log('authMW - user :: ', verifyResponse);
      const id = verifyResponse._id;
      const user = await userModel.findById(id);

      // const expires = Date.parse(cookies.Expires);
      // let date = new Date().toUTCString();
      // let now = Date.parse(date);
      // console.log(expires, now);

      // if (expires - now < 60000) {
      //   // 60000 * 5
      //   console.log('user:: ', user);
      //   if (user && user.refreshToken) {
      //     const expiresIn = 60 * 60 * 5;
      //     const secret = process.env.JWT_SECRET;
      //     const dataInToken: DataInToken = {
      //       _id: id,
      //     };
      //     const tokenData = await {
      //       expiresIn,
      //       token: jwt.sign(dataInToken, secret, { expiresIn }),
      //     };
      //     console.log('getToken :: ', user, tokenData);
      //     res.setHeader('Set-Cookie', [
      //       `Authorization=${tokenData.token};HttpOnly;Max-Age=${tokenData.expiresIn}`,
      //     ]);
      //   } else {
      //     next(new NoTokenException());
      //   }
      // } else {
      //   next(new WrongTokenException());
      // }

      if (user) {
        req.user = user;
        next();
      } else {
        next(new WrongTokenException());
      }
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        next(new NotAuthorizedJWTException());
      }
      next(new WrongTokenException());
    }
  } else {
    next(new NoTokenException());
  }
}

export default authMiddleware;
