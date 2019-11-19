import * as express from 'express';
import Reward from './reward.interface';
import Controller from '../interfaces/controller.interface';
import rewardModel from './rewards.model';
import validationMiddleware from '../middleware/validation.middleware';
import CreateRewardDto from './reward.dto';
import NotFoundException from '../exceptions/NotFoundException';

class RewardsController implements Controller {
  public path = '/rewards';
  public router = express.Router();
  private reward = rewardModel;

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(this.path, this.getAllRewards);
    this.router.get(`${this.path}/:id`, this.getRewardById);
    this.router.patch(
      `${this.path}/:id`,
      validationMiddleware(CreateRewardDto, true),
      this.modifyReward,
    );
    this.router.delete(`${this.path}/:id`, this.deleteReward);
    this.router.post(
      this.path,
      validationMiddleware(CreateRewardDto),
      this.createReward,
    );
  }

  private getAllRewards = (req: express.Request, res: express.Response) => {
    this.reward.find().then(rewards => res.send(rewards));
  };
  private getRewardById = (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    const id = req.params.id;
    this.reward.findById(id).then(reward => {
      if (reward) res.send(reward);
      else new NotFoundException(id, this.path);
    });
  };
  private modifyReward = (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    const id = req.params.id;
    const rewardData: Reward = req.body;
    this.reward
      .findByIdAndUpdate(id, rewardData, { new: true })
      .then(reward => {
        if (reward) res.send(reward);
        else new NotFoundException(id, this.path);
      });
  };
  private deleteReward = (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    const id = req.params.id;
    this.reward.findByIdAndDelete(id).then(success => {
      if (success) res.send(200);
      else new NotFoundException(id, this.path);
    });
  };
  private createReward = (req: express.Request, res: express.Response) => {
    const rewardData: Reward = req.body;
    const createReward = new this.reward(rewardData);
    createReward.save().then(savedReward => res.send(savedReward));
  };
}

export default RewardsController;
