import * as express from 'express';
import Reward from './reward.interface';
import Controller from '../interfaces/controller.interface';
import rewardModel from './rewards.model';
import validationMiddleware from '../middleware/validation.middleware';
import CreateRewardDto from './reward.dto';
import NotFoundException from '../exceptions/NotFoundException';
import authMiddleware from 'middleware/auth.middleware';
import ReqWithUser from 'interfaces/reqWithUser.interface';
import ReqWithUser from 'interfaces/reqWithUser.interface';
import ReqWithUser from 'interfaces/reqWithUser.interface';

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
    this.router
      .all(`${this.path}/*`, authMiddleware)
      .patch(
        `${this.path}/:id`,
        validationMiddleware(CreateRewardDto, true),
        this.modifyReward,
      )
      .delete(`${this.path}/:id`, this.deleteReward)
      .post(
        this.path,
        authMiddleware,
        validationMiddleware(CreateRewardDto),
        this.createReward,
      );
  }

  private getAllRewards = async (
    req: express.Request,
    res: express.Response,
  ) => {
    const rewards = await this.reward.find();
    res.send(rewards);
  };
  private getRewardById = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    const id = req.params.id;
    const reward = await this.reward.findById(id);
    if (reward) res.send(reward);
    else new NotFoundException(id, this.path);
  };
  private modifyReward = async (
    req: ReqWithUser,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    const id = req.params.id;
    const rewardData: Reward = req.body;
    const reward = await this.reward.findByIdAndUpdate(id, rewardData, {
      new: true,
    });

    if (reward) res.send(reward);
    else new NotFoundException(id, this.path);
  };
  private deleteReward = async (
    req: ReqWithUser,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    const id = req.params.id;
    const successResponse = this.reward.findByIdAndDelete(id);
    if (successResponse) res.send(200);
    else new NotFoundException(id, this.path);
  };
  private createReward = async (req: ReqWithUser, res: express.Response) => {
    const rewardData: Reward = req.body;
    const createReward = new this.reward({
      ...rewardData,
      verifiedId: req.user._id,
    });
    const savedReward = await createReward.save();
    res.send(savedReward);
  };
}

export default RewardsController;
