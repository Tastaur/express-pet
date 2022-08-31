import { App } from "./app";
import { LoggerService } from "./services/logger/logger.service";
import { ExampleController } from "./controllers/examples/examples.controller";
import { ROUTE_NAME } from "./globalConstants";
import { UsersController } from "./controllers/users/users.controller";
import { ExceptionFilter } from "./services/exceptionFIlter/exception.filter.service";

async function runApp() {
  const logger = new LoggerService();
  const app = new App({
    logger,
    example: new ExampleController(logger, ROUTE_NAME.EXAMPLE),
    users: new UsersController(logger, ROUTE_NAME.USERS),
    exceptionFilter: new ExceptionFilter(logger),
  });
  await app.init();
}

runApp();