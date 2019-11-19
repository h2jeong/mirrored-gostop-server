import HttpException from './HttpException';

class NoTokenException extends HttpException {
  constructor() {
    super(406, 'No Token');
  }
}

export default NoTokenException;
