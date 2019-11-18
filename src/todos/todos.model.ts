import * as mongoose from 'mongoose';
import Todo from './todo.interface';

const todoSchema = new mongoose.Schema({
  user: String,
  title: { type: String, required: true },
  description: String,
  difficulty: { type: Number, default: 0, max: 10 },
  dateStart: { type: Date, default: Date.now },
  dateEnd: { type: Date, default: Date.now },
  alarmActive: { type: Boolean, default: false },
  alarm: String,
  coin: { type: Number, default: 0 },
  point: { type: Number, default: 0 },
  health: { type: Number, default: 0 },
  completed: { type: Boolean, default: false },
  any: [mongoose.Schema.Types.Mixed],
  id: mongoose.Schema.Types.ObjectId,
});

const todoModel = mongoose.model<Todo & mongoose.Document>('Todo', todoSchema);

export default todoModel;
