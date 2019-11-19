import App from './app';
import 'dotenv/config';
import validateEnv from './utils/validateEnv';
import TodosController from './todos/todos.controller';
import HabitsController from './habits/habits.controller';
import RewardsController from './rewards/rewards.controller';

validateEnv();

const app = new App([
  new TodosController(),
  new HabitsController(),
  new RewardsController(),
]);

app.listen();
