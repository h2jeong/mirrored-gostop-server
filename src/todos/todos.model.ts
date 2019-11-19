import * as mongoose from 'mongoose';
import Todo from './todo.interface';

// for test : user, alarm, date => dataType string
const todoSchema = new mongoose.Schema(
  {
    verifiedId: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    difficulty: { type: Number, default: 0, max: 10, required: true },
    dateStart: { type: String, default: Date.now, required: true },
    dateEnd: { type: String, default: Date.now, required: true },
    alarmActive: { type: Boolean, default: false, required: true },
    alarm: { type: String, required: true },
    coin: { type: Number, default: 0, required: true },
    point: { type: Number, default: 0, required: true },
    health: { type: Number, default: 0, required: true },
    completed: { type: Boolean, default: false, required: true },
  },
  { _id: true, timestamps: true },
);

const todoModel = mongoose.model<Todo & mongoose.Document>('Todo', todoSchema);

export default todoModel;
