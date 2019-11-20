import * as mongoose from 'mongoose';
import Habit from './habit.interface';

const habitSchema = new mongoose.Schema(
  {
    verifiedId: { ref: 'User', type: mongoose.Schema.Types.ObjectId },
    title: String,
    description: String,
    difficulty: { type: Number, default: 0, max: 10 },
    alarmActive: { type: Boolean, default: false },
    alarm: String,
    coin: { type: Number, default: 0 },
    point: { type: Number, default: 0 },
    health: { type: Number, default: 0 },
    positive: { type: Boolean, default: false },
    completed: { type: Boolean, default: false },
  },
  {
    _id: true,
    timestamps: true,
  },
);

const habitModel = mongoose.model<Habit & mongoose.Document>(
  'Habit',
  habitSchema,
);

export default habitModel;
