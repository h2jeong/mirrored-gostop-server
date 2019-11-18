import App from './app';
import TodosController from './todos/todos.controller';
import 'dotenv/config';
import validateEnv from './utils/validateEnv';

validateEnv();

const app = new App([new TodosController()]);

app.listen();
