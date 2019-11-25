import * as express from 'express';
import Todo from './todo.interface';
import Controller from '../interfaces/controller.interface';
import todoModel from './todos.model';
import CreateTodoDto from './todo.dto';
import NotFoundException from '../exceptions/NotFoundException';
import validationMiddleware from '../middleware/validation.middleware';
import authMiddleware from '../middleware/auth.middleware';
import ReqWithUser from '../interfaces/reqWithUser.interface';
import galleryModel from '../galleries/gallerys.model';

class TodosController implements Controller {
  public path = '/todos';
  public router = express.Router();
  private todo = todoModel;
  private gallery = galleryModel;

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(this.path, this.getAllTodos);
    this.router.get(`${this.path}/:id`, this.getTodoById);
    this.router.get(`${this.path}/:id/gallery`, this.getGallery);
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

  private getAllTodos = async (req: express.Request, res: express.Response) => {
    const todos = await this.todo.find();
    res.send(todos);
  };
  private getTodoById = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    const id = req.params.id;
    const todo = await this.todo
      .findById(id)
      .populate('gallery', 'files')
      .populate('verifiedId', '_id, name');
    if (todo) {
      res.send(todo);
    } else {
      next(new NotFoundException(id, this.path));
    }
  };
  private getGallery = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    const id = req.params.id;
    console.log('getgalltodo::', id);
    const gallery = await this.gallery
      .find({ todo: id })
      .populate('todo', '_id, title completed');
    if (gallery) {
      res.send(gallery);
    } else {
      next(new NotFoundException(id, this.path));
    }
  };

  private modifyTodo = async (
    req: express.Request,
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
  private deleteTodo = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    const id = req.params.id;
    const successResponse = await this.todo.findByIdAndDelete(id);

    if (successResponse) res.send(200);
    else next(new NotFoundException(id, this.path));
  };
  private createTodo = async (req: ReqWithUser, res: express.Response) => {
    console.log('createTodo ::', req.body);
    const todoData: CreateTodoDto = req.body;
    const createdTodo = new this.todo({
      ...todoData,
      verifiedId: req.user._id,
      // Two-way referencing
      // verifiedId: [req.user._id]
    });
    // Two-way referencing
    /* 
    const user = await this.user.findById(req.user._id);
    user.todos = [...user.todos, createTodo._id];
    await user.save();
    */
    const savedTodo = await createdTodo.save();
    savedTodo.populate('verifiedId', '_id, name').execPopulate();
    res.send(savedTodo);
  };
}

export default TodosController;
