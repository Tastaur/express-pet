import { App } from "./app";
import { LoggerService } from "./logger/logger.service";
import { ExampleController } from "./examples/examples.controller";
import { ExceptionFilter } from "./exceptionFIlter/exception.filter";

const runApp = async () => {
  const logger = new LoggerService();
  const app = new App({
    logger,
    example: new ExampleController(logger),
    exceptionFilter: new ExceptionFilter(logger),
  });
  await app.init();
};

runApp();