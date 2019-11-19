import * as express from 'express';
import Todo from './todo.interface';
import Controller from '../interfaces/controller.interface';
import todoModel from './todos.model';

class TodosController implements Controller {
  public path = '/todos';
  public router = express.Router();
  private todo = todoModel;

  constructor() {
    this.initializeRoutes();
  }

  public initializeRoutes() {
    this.router.get(this.path, this.getAllTodos);
    this.router.get(`${this.path}/:id`, this.getTodoById);
    this.router.patch(`${this.path}/:id`, this.modifyTodo);
    this.router.delete(`${this.path}/:id`, this.deleteTodo);
    this.router.post(this.path, this.createTodo);
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
        res.status(404).send({ error: 'Todo not found' });
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
  private modifyTodo = (req: express.Request, res: express.Response) => {
    console.log('modifyTodo ::', req.body);
    const id = req.params.id;
    const todoData: Todo = req.body;
    this.todo
      .findByIdAndUpdate(id, todoData, { new: true })
      .then(todo => res.send(todo));
  };
  private deleteTodo = (req: express.Request, res: express.Response) => {
    const id = req.params.id;
    this.todo.findByIdAndDelete(id).then(success => {
      if (success) res.send(200);
      else res.send(404);
    });
  };
}

export default TodosController;
