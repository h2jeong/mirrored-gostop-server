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
      `${this.path}/:id/todos`,
      authMiddleware,
      this.getAllTodosOfUser,
    );
    this.router.get(
      `${this.path}/:id/habits`,
      authMiddleware,
      this.getAllHabitsOfUser,
    );
    this.router.get(
      `${this.path}/:id/rewards`,
      authMiddleware,
      this.getAllRewardsOfUser,
    );
  }

  private getAllTodosOfUser = async (
    req: ReqWithUser,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    const userId = req.params.id;
    if (userId === req.user._id.toString()) {
      const todos = await this.todo.find({ verifiedId: userId });
      res.send(todos);
    } else {
      next(new NotAuthorizedException());
    }
  };
  private getAllHabitsOfUser = async (
    req: ReqWithUser,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    const userId = req.params.id;
    if (userId === req.user._id.toString()) {
      const habits = await this.habit.find({ verifiedId: userId });
      res.send(habits);
    } else {
      next(new NotAuthorizedException());
    }
  };
  private getAllRewardsOfUser = async (
    req: ReqWithUser,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    const userId = req.params.id;
    if (userId === req.user._id.toString()) {
      const rewards = await this.reward.find({ verifiedId: userId });
      res.send(rewards);
    } else {
      next(new NotAuthorizedException());
    }
  };
}

export default UserController;
