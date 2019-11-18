import * as express from 'express';
import Reward from './reward.interface';
import Controller from '../interfaces/controller.interface';

class RewardsController implements Controller {
  public path = '/rewards';
  public router = express.Router();
  private rewards: Reward[] = [
    {
      user: 'Howl',
      title: 'Castle',
      description: 'Emerald',
      coin: -30,
    },
  ];
  constructor() {
    this.initializeRoutes();
  }

  public initializeRoutes() {
    this.router.get(this.path, this.getAllRewards);
    this.router.post(this.path, this.createReward);
  }

  getAllRewards = (req: express.Request, res: express.Response) => {
    res.send(this.rewards);
  };

  createReward = (req: express.Request, res: express.Response) => {
    const reward = req.body;
    this.rewards.push(reward);
    res.send(reward);
  };
}

export default RewardsController;
