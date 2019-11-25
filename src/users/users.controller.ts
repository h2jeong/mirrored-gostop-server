import * as express from 'express';
import authMiddleware from '../middleware/auth.middleware';
import ReqWithUser from '../interfaces/reqWithUser.interface';
import Controller from '../interfaces/controller.interface';
import todoModel from '../todos/todos.model';
import NotAuthorizedException from '../exceptions/NotAuthorizedException';
import habitModel from '../habits/habits.model';
import rewardModel from '../rewards/rewards.model';

class UserController implements Controller {
  public path = '/users';
  public router = express.Router();
  private todo = todoModel;
  private habit = habitModel;
  private reward = rewardModel;

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
  }

  private getAllTodosOfUser = async (
    req: ReqWithUser,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    const userId = req.user._id;
    // console.log('alltodo::', userId);
    const todos = await this.todo
      .find({ verifiedId: userId })
      .populate('verifiedId', '_id');
    res.send({ count: todos.length, todos: todos });
  };
  private getAllHabitsOfUser = async (
    req: ReqWithUser,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    const userId = req.user._id;
    const habits = await this.habit
      .find({ verifiedId: userId })
      .populate('verifiedId', '_id');
    res.send({ count: habits.length, habits: habits });
  };
  private getAllRewardsOfUser = async (
    req: ReqWithUser,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    const userId = req.user._id;
    const rewards = await this.reward
      .find({ verifiedId: userId })
      .populate('verifiedId', '_id');
    res.send({ count: rewards.length, rewards: rewards });
  };
}

export default UserController;
