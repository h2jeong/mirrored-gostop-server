import * as express from 'express';
import Todo from './todo.interface';
import Controller from '../interfaces/controller.interface';
import todoModel from './todos.model';
import CreateTodoDto from './todo.dto';
import NotFoundException from '../exceptions/NotFoundException';
import validationMiddleware from '../middleware/validation.middleware';
import authMiddleware from '../middleware/auth.middleware';
import ReqWithUser from '../interfaces/reqWithUser.interface';

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
    this.router
      .all(`${this.path}/*`, authMiddleware)
      .patch(
        `${this.path}/:id`,
        validationMiddleware(CreateTodoDto, true),
        this.modifyTodo,
      )
      .delete(`${this.path}/:id`, this.deleteTodo)
      .post(
        this.path,
        authMiddleware,
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
        next(new NotFoundException(id, this.path));
      }
    });
  };
  private createTodo = async (req: ReqWithUser, res: express.Response) => {
    console.log('createTodo ::', req.body);
    const todoData: Todo = req.body;
    const createdTodo = new this.todo({
      ...todoData,
      veryfiedId: req.user._id,
    });
    const savedTodo = await createdTodo.save();
    res.send(savedTodo);
  };
  private modifyTodo = async (
    req: ReqWithUser,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    console.log('modifyTodo ::', req.body);
    const id = req.params.id;
    const todoData: Todo = req.body;
    const todo = await this.todo.findByIdAndUpdate(id, todoData, { new: true });
    if (todo) {
      res.send(todo);
    } else {
      next(new NotFoundException(id, this.path));
    }
  };
  private deleteTodo = async (req: ReqWithUser, res: express.Response) => {
    const id = req.params.id;
    const successResponse = this.todo.findByIdAndDelete(id);

    if (successResponse) res.send(200);
    else new NotFoundException(id, this.path);
  };
}

export default TodosController;
