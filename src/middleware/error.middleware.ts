import { NextFunction, Request, Response } from 'express';
import HttpException from '../exceptions/HttpException';

function errorMiddleware(error: HttpException, req: Request, res: Response) {
  const status = error.status || 500;
  const message = error.message || 'Something went wrong';
  res.status(status).send({ message, status });
}

export default errorMiddleware;
