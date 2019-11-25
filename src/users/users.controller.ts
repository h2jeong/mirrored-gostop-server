import * as express from 'express';
import authMiddleware from '../middleware/auth.middleware';
import ReqWithUser from '../interfaces/reqWithUser.interface';
import Controller from '../interfaces/controller.interface';
import todoModel from '../todos/todos.model';
import NotAuthorizedException from '../exceptions/NotAuthorizedException';
import habitModel from '../habits/habits.model';
import rewardModel from '../rewards/rewards.model';
import orderModel from '../orders/orders.model';

class UserController implements Controller {
  public path = '/users';
  public router = express.Router();
  private todo = todoModel;
  private habit = habitModel;
  private reward = rewardModel;
  private order = orderModel;

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(
      `${this.path}/todos`,
      authMiddleware,
      this.getAllTodosOfUser,
    );
    this.router.get(
      `${this.path}/habits`,
      authMiddleware,
      this.getAllHabitsOfUser,
    );
    this.router.get(
      `${this.path}/rewards`,
      authMiddleware,
      this.getAllRewardsOfUser,
    );
    this.router.get(
      `${this.path}/shop`,
      authMiddleware,
      this.getAllOrdersOfUser,
    );
    this.router.get(
      `${this.path}/hasItems`,
      authMiddleware,
      this.getAllItemsOfUser,
    );
  }

  private getAllTodosOfUser = async (
    req: ReqWithUser,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    const userId = req.user._id;
    // console.log('alltodo::', userId);
    const todos = await this.todo.find({ verifiedId: userId });
    res.send({ count: todos.length, user: userId, todos: todos });
  };
  private getAllHabitsOfUser = async (
    req: ReqWithUser,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    const userId = req.user._id;
    const habits = await this.habit.find({ verifiedId: userId });
    res.send({ count: habits.length, user: userId, habits: habits });
  };
  private getAllRewardsOfUser = async (
    req: ReqWithUser,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    const userId = req.user._id;
    const rewards = await this.reward.find({ verifiedId: userId });
    res.send({ count: rewards.length, user: userId, rewards: rewards });
  };
  private getAllOrdersOfUser = async (
    req: ReqWithUser,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    const userId = req.user._id;
    const orders = await this.order.find({ verifiedId: userId });
    res.send({ count: orders.length, user: userId, orders: orders });
  };
  private getAllItemsOfUser = async (
    req: ReqWithUser,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    const userId = req.user._id;
    const hasItems = await this.order
      .find({ verifiedId: userId })
      .populate('item', '_id category name activity');
    res.send({ count: hasItems.length, user: userId, hasItems: hasItems });
  };
}

export default UserController;
