import * as mongoose from 'mongoose';
import User from './user.interface';

const userSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    password: String,
    level: { type: Number, default: 1 },
    coin: { type: Number, default: 0 },
    point: { type: Number, default: 0 },
    health: { type: Number, default: 200 },
    status: { type: Boolean, default: true },
    userCode: { type: Number, default: 1 },

    refreshToken: String,
    // Two-way referencing
    // todos: [{ ref: 'Todo', type: mongoose.Schema.Types.ObjectId }],
    // habits: [{ ref: 'Habit', type: mongoose.Schema.Types.ObjectId }],
    // reward: [{ ref: 'Reward', type: mongoose.Schema.Types.ObjectId }],
  },
  { _id: true, timestamps: true },
);

const userModel = mongoose.model<User & mongoose.Document>('User', userSchema);

export default userModel;
