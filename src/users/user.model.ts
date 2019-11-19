import * as mongoose from 'mongoose';
import User from './user.interface';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  level: { type: Number, default: 1, required: true },
  coin: { type: Number, default: 0, required: true },
  point: { type: Number, default: 0, required: true },
  health: { type: Number, default: 0, required: true },
  status: { type: Boolean, default: true, required: true },
  userCode: { type: Number, default: 1, required: true },
});

const userModel = mongoose.model<User & mongoose.Document>('User', userSchema);

export default userModel;
