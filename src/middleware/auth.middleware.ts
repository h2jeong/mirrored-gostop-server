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
  console.log('authMW :: ', cookies);
  if (cookies && cookies.Authorization) {
    const secret = process.env.JWT_SECRET;
    // If the token is wrong, or it expired, the jwt.verify function throws an error and we need to catch it.
    try {
      const verifyResponse = jwt.verify(
        cookies.Authorization,
        secret,
      ) as DataInToken;
      const id = verifyResponse._id;
      const user = await userModel.findById(id);
      console.log('authMW - user :: ', verifyResponse, user);
      if (user) {
        req.user = user;
      } else {
        next(new WrongTokenException());
      }
      console.log('authMW :: 성공 ?');
    } catch (error) {
      next(new WrongTokenException());
    }
  } else {
    next(new NoTokenException());
  }
}

export default authMiddleware;
