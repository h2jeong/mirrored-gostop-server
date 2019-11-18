import * as express from 'express';

function loggerMiddleware(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  console.log(`${req.method} ${req.path}`);
  next();
}

export default loggerMiddleware;
