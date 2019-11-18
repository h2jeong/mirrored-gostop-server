import App from './app';
import TodosController from './todos/todos.controller';

const app = new App([new TodosController()], 5000);

app.listen();
