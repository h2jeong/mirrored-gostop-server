import * as mongoose from 'mongoose';
import Reward from './reward.interface';

const rewardSchema = new mongoose.Schema(
  {
    user: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    coin: { type: Number, default: 20, required: true },
  },
  { _id: true, timestamps: true },
);

const rewardModel = mongoose.model<Reward & mongoose.Document>(
  'Reward',
  rewardSchema,
);

export default rewardModel;
