import * as express from 'express';
import Todo from './todo.interface';
import Controller from '../interfaces/controller.interface';

class TodosController implements Controller {
  public path = '/todos';
  public router = express.Router();

  private todos: Todo[] = [
    {
      user: 'Howl',
      title: "Howl's Moving Castle",
      description:
        '일본 거장 애니메이터 미야자키 하야오가 감독한 지브리 스튜디오의 장편 애니메이션',
      difficulty: 1,
      dateStart: Date(),
      dateEnd: Date(),
      alarmActive: false,
      alarm: '',
      coin: 10,
      point: 20,
      health: 40,
      completed: false,
    },
  ];

  constructor() {
    this.initializeRoutes();
  }

  public initializeRoutes() {
    this.router.get(this.path, this.getAllTodos);
    this.router.post(this.path, this.createTodo);
  }

  getAllTodos = (req: express.Request, res: express.Response) => {
    res.send(this.todos);
  };

  createTodo = (req: express.Request, res: express.Response) => {
    const todo: Todo = req.body;
    this.todos.push(todo);
    res.send(todo);
  };
}

export default TodosController;
