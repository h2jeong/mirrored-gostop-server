import * as mongoose from 'mongoose';
import Todo from './todo.interface';

// for test : user, alarm, date => dataType string
const todoSchema = new mongoose.Schema(
  {
    verifiedId: { ref: 'User', type: mongoose.Schema.Types.ObjectId },
    title: String,
    description: String,
    difficulty: { type: Number, default: 10 },
    dateStart: { type: Date, default: Date.now },
    dateEnd: { type: Date, default: Date.now },
    alarm: { ref: 'Alarm', type: mongoose.Schema.Types.ObjectId },
    coin: { type: Number, default: 10 },
    point: { type: Number, default: 10 },
    health: { type: Number, default: 10 },
    gallery: [{ ref: 'Gallery', type: mongoose.Schema.Types.ObjectId }],
    completed: { type: Boolean, default: false },
  },
  { _id: true, timestamps: false },
);

const todoModel = mongoose.model<Todo & mongoose.Document>('Todo', todoSchema);

export default todoModel;
