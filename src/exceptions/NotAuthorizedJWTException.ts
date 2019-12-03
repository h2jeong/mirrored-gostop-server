import HttpException from './HttpException';

class NotAuthorizedJWTException extends HttpException {
  constructor() {
    super(401, `Not Authorized JWT Exception`);
  }
}

export default NotAuthorizedJWTException;
