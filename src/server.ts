import App from './app';
import 'dotenv/config';
import validateEnv from './utils/validateEnv';
import TodosController from './todos/todos.controller';
import HabitsController from './habits/habits.controller';
import RewardsController from './rewards/rewards.controller';
import AuthenticationController from './auth/authentication.controller';
import UserController from './users/users.controller';
import GalleryController from './galleries/gallerys.controller';

validateEnv();

const app = new App([
  new TodosController(),
  new HabitsController(),
  new RewardsController(),
  new AuthenticationController(),
  new UserController(),
  new GalleryController(),
]);

app.listen();
