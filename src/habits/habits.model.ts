import * as mongoose from 'mongoose';
import Habit from './habit.interface';

const habitSchema = new mongoose.Schema(
  {
    verifiedId: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    difficulty: { type: Number, default: 0, max: 10, required: true },
    alarmActive: { type: Boolean, default: false, required: true },
    alarm: { type: String, required: true },
    coin: { type: Number, default: 0, required: true },
    point: { type: Number, default: 0, required: true },
    health: { type: Number, default: 0, required: true },
    positive: { type: Boolean, default: false, required: true },
    completed: { type: Boolean, default: false, required: true },
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
