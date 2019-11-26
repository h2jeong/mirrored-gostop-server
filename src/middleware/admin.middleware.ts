import * as express from 'express';
import userModel from '../users/user.model';
import LogInDto from '../auth/logIn.dto';
import ReqWithUser from '../interfaces/reqWithUser.interface';
import NoAdminException from '../exceptions/NoAdminException';

async function adminMiddleware(
  req: ReqWithUser,
  res: express.Response,
  next: express.NextFunction,
) {
  console.log('try ::', req.user);
  const adminData = req.user;
  // const admin = await userModel.findOne({ email: adminData });
  // console.log('adminData :: ', admin);
  if (adminData.userCode === 2) {
    req.user = adminData;
    // console.log('통과?');
    next();
  } else {
    next(new NoAdminException());
  }
}

export default adminMiddleware;
