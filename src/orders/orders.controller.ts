import * as express from 'express';
import Controller from '../interfaces/controller.interface';
import orderModel from './orders.model';
import CreateOrderDto from './order.dto';
import ReqWithUser from '../interfaces/reqWithUser.interface';
import authMiddleware from '../middleware/auth.middleware';

class OrdersController implements Controller {
  public path = '/shop';
  public router = express.Router();
  private order = orderModel;

  constructor() {
    this.initializeRouter();
  }

  private initializeRouter() {
    this.router.get(this.path, this.getAllOrders);
    this.router.get(`${this.path}/:id`, this.getOrderById);
    this.router.patch(`${this.path}/:id`, this.modifyOrder);
    this.router.delete(`${this.path}/:id`, this.deleteOrder);
    this.router.post(this.path, authMiddleware, this.createOrder);
  }

  private getAllOrders = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    const orders = await this.order
      .find()
      .populate('verifiedId item', '_id name itemImg');
    res.send(orders);
  };
  private getOrderById = (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {};
  private modifyOrder = (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {};
  private deleteOrder = (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {};
  private createOrder = async (
    req: ReqWithUser,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    const orderData: CreateOrderDto = req.body;
    const createdOrder = new this.order({
      ...orderData,
      verifiedId: req.user._id,
    });
    const savedOrder = await createdOrder.save();
    savedOrder.populate('verifiedId item');
    res.send(savedOrder);
  };
}

export default OrdersController;
