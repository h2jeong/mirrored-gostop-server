import * as express from 'express';
import Habit from './habit.interface';
import Controller from '../interfaces/controller.interface';
import habitModel from './habits.model';
import validationMiddleware from '../middleware/validation.middleware';
import CreateHabitDto from './habit.dto';
import NotFoundException from '../exceptions/NotFoundException';

class HabitsController implements Controller {
  public path = '/habits';
  public router = express.Router();
  private habit = habitModel;

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(this.path, this.getAllHabits);
    this.router.get(`${this.path}/:id`, this.getHabitById);
    this.router.patch(
      `${this.path}/:id`,
      validationMiddleware(CreateHabitDto, true),
      this.modifyHabit,
    );
    this.router.delete(`${this.path}/:id`, this.deleteHabit);
    this.router.post(
      this.path,
      validationMiddleware(CreateHabitDto),
      this.createHabit,
    );
  }

  private getAllHabits = (req: express.Request, res: express.Response) => {
    this.habit.find().then(habits => {
      res.send(habits);
    });
  };
  private getHabitById = (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    const id = req.params.id;
    this.habit.findById(id).then(habit => {
      if (habit) res.send(habit);
      else next(new NotFoundException(id, this.path));
    });
  };
  private modifyHabit = (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    const id = req.params.id;
    const habitData: Habit = req.body;
    this.habit.findByIdAndUpdate(id, habitData, { new: true }).then(habit => {
      if (habit) res.send(habit);
      else next(new NotFoundException(id, this.path));
    });
  };
  private deleteHabit = (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    const id = req.params.id;
    this.habit.findByIdAndDelete(id).then(success => {
      if (success) res.send(200);
      else new NotFoundException(id, this.path);
    });
  };
  private createHabit = (req: express.Request, res: express.Response) => {
    const habitData: Habit = req.body;
    const createdHabit = new this.habit(habitData);
    createdHabit.save().then(savedHabit => res.send(savedHabit));
  };
}

export default HabitsController;
