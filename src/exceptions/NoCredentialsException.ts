import HttpException from './HttpException';

class NoCredentialsException extends HttpException {
  constructor() {
    super(401, '');
  }
}

export default NoCredentialsException;
