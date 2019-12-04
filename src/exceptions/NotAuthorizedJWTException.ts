import HttpException from './HttpException';

class NotAuthorizedJWTException extends HttpException {
  constructor() {
    super(401, `TokenExpiredError: jwt expired`);
  }
}

export default NotAuthorizedJWTException;
