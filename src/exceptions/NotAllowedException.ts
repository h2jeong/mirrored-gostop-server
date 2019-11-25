import HttpException from './HttpException';

class NotAllowedException extends HttpException {
  constructor() {
    super(400, `Only image allowed`);
  }
}

export default NotAllowedException;
