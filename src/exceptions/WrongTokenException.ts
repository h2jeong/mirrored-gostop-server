import HttpException from './HttpException';

class WrongTokenException extends HttpException {
  constructor() {
    super(404, 'Wrong Token');
  }
}

export default WrongTokenException;
