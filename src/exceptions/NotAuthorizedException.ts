import HttpException from './HttpException';

class NotAuthorizedException extends HttpException {
  constructor() {
    super(401, 'NotAuthorizedException');
  }
}

export default NotAuthorizedException;
