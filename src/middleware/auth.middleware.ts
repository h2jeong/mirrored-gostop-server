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
  console.log('authmw::cookies ::', cookies);
  if (cookies && cookies.Authorization) {
    const secret = process.env.JWT_SECRET;
    // If the token is wrong, or it expired, the jwt.verify function throws an error and we need to catch it.
    try {
      const verifyResponse = (await jwt.verify(
        cookies.Authorization,
        secret,
      )) as DataInToken;
      const id = verifyResponse._id;
      const user = await userModel.findById(id);
      console.log('authmw::verifyResponse ::', verifyResponse, user);
      if (user) {
        req.user = user;
        next();
      } else {
        console.log('authmw:: no user');
        next(new WrongTokenException());
      }
    } catch (error) {
      console.log('authmw::', error.message);
      next(new WrongTokenException());
    }
  } else {
    console.log('authmw::NoTokenException');
    next(new NoTokenException());
  }
}

export default authMiddleware;
