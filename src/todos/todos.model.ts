import * as mongoose from 'mongoose';
import Todo from './todo.interface';

// for test : user, alarm, date => dataType string
const todoSchema = new mongoose.Schema(
  {
    verifiedId: { ref: 'User', type: mongoose.Schema.Types.ObjectId },
    title: String,
    description: String,
    difficulty: { type: Number, default: 0 },
    dateStart: String,
    dateEnd: String,
    alarmActive: { type: Boolean, default: false },
    alarm: String,
    coin: { type: Number, default: 0 },
    point: { type: Number, default: 0 },
    health: { type: Number, default: 0 },
    completed: { type: Boolean, default: false },
  },
  { _id: true, timestamps: true },
);

const todoModel = mongoose.model<Todo & mongoose.Document>('Todo', todoSchema);

export default todoModel;
