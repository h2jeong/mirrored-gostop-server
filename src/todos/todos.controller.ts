import * as express from 'express';
import Todo from './todo.interface';
import Controller from '../interfaces/controller.interface';
import todoModel from './todos.model';
import CreateTodoDto from './todo.dto';
import NotFoundException from '../exceptions/NotFoundException';
import validationMiddleware from '../middleware/validation.middleware';

class TodosController implements Controller {
  public path = '/todos';
  public router = express.Router();
  private todo = todoModel;

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(this.path, this.getAllTodos);
    this.router.get(`${this.path}/:id`, this.getTodoById);
    this.router.patch(
      `${this.path}/:id`,
      validationMiddleware(CreateTodoDto, true),
      this.modifyTodo,
    );
    this.router.delete(`${this.path}/:id`, this.deleteTodo);
    this.router.post(
      this.path,
      validationMiddleware(CreateTodoDto),
      this.createTodo,
    );
  }

  private getAllTodos = (req: express.Request, res: express.Response) => {
    this.todo.find().then(todos => {
      res.send(todos);
    });
  };
  private getTodoById = (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    const id = req.params.id;
    this.todo.findById(id).then(todo => {
      if (todo) {
        res.send(todo);
      } else {
        // res.status(404).send({ error: 'Todo not found' });
        // next(new HttpException(404, 'Post not found'));
        next(new NotFoundException(id, this.path));
      }
    });
  };
  private createTodo = (req: express.Request, res: express.Response) => {
    console.log('createTodo ::', req.body);
    const todoData: Todo = req.body;
    const createdTodo = new this.todo(todoData);
    createdTodo.save().then(savedTodo => {
      res.send(savedTodo);
    });
  };
  private modifyTodo = (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    console.log('modifyTodo ::', req.body);
    const id = req.params.id;
    const todoData: Todo = req.body;
    this.todo.findByIdAndUpdate(id, todoData, { new: true }).then(todo => {
      if (todo) {
        res.send(todo);
      } else {
        next(new NotFoundException(id, this.path));
      }
    });
  };
  private deleteTodo = (req: express.Request, res: express.Response) => {
    const id = req.params.id;
    this.todo.findByIdAndDelete(id).then(success => {
      if (success) res.send(200);
      else new NotFoundException(id, this.path);
    });
  };
}

export default TodosController;
