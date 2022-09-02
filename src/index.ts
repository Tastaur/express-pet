import { App } from "./app";
import { ExampleController } from "./controllers/examples/examples.controller";
import { ROUTE_NAME } from "./globalConstants";
import { UsersController } from "./controllers/users/users.controller";
import { ExceptionFilter } from "./services/exceptionFIlter/exception.filter.service";

async function runApp() {
  const app = new App({
    example: new ExampleController(ROUTE_NAME.EXAMPLE),
    users: new UsersController(ROUTE_NAME.USERS),
    exceptionFilter: new ExceptionFilter(),
  });
  await app.init();
}

runApp();