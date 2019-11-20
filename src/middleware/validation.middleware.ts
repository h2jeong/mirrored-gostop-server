import { plainToClass } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import * as express from 'express';
import HttpException from '../exceptions/HttpException';

function validationMiddleware<T>(
  type: any,
  skipMissingProperties = false,
): express.RequestHandler {
  console.log('validMv :: 여긴데 ', type);
  return (req, res, next) => {
    console.log('validMW :: ', type, req.body, req.header);
    validate(plainToClass(type, req.body), { skipMissingProperties }).then(
      (errors: ValidationError[]) => {
        if (errors.length > 0) {
          const message = errors
            .map((error: ValidationError) => Object.values(error.constraints))
            .join(', ');
          next(new HttpException(400, message));
        } else {
          console.log('validMW :: 성공?');
          next();
        }
      },
    );
  };
}

export default validationMiddleware;
