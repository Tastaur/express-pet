import { App } from "./app";
import { LoggerService } from "./services/logger/logger.service";
import { ExampleController } from "./controllers/examples/examples.controller";
import { ExceptionFilter } from "./services/exceptionFIlter/exception.filter";
import { ROUTE_NAME } from "./globalConstants";

async function runApp() {
  const logger = new LoggerService();
  const app = new App({
    logger,
    example: new ExampleController(logger, ROUTE_NAME.EXAMPLE),
    exceptionFilter: new ExceptionFilter(logger),
  });
  await app.init();
}

runApp();