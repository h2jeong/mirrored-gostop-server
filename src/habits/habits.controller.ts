import * as express from 'express';
import Habit from './habit.interface';
import Controller from '../interfaces/controller.interface';

class HabitsController implements Controller {
  public path = '/habits';
  public router = express.Router();

  private habits: Habit[] = [
    {
      user: 'Sowl',
      title: "Sowl's Driving Castle",
      description: '일본 거장 VJ 미야자키가 제작한 지브리 스튜디오의 단편 영화',
      difficulty: 1,
      alarmActive: false,
      alarm: '',
      coin: 15,
      point: 30,
      health: 30,
      positive: true,
      completed: false,
    },
  ];
  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(this.path, this.getAllHabits);
    this.router.post(this.path, this.createHabit);
  }

  private getAllHabits = (req: express.Request, res: express.Response) => {
    res.send(this.habits);
  };

  private createHabit = (req: express.Request, res: express.Response) => {
    const habit = req.body;
    this.habits.push(habit);
    res.send(habit);
  };
}

export default HabitsController;
