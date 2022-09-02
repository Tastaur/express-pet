import { App } from "./app";
import { ExampleController } from "./controllers/examples/examples.controller";
import { UsersController } from "./controllers/users/users.controller";
import { ExceptionFilter } from "./services/exceptionFIlter/exception.filter.service";
import { Container } from "inversify";
import { ILogger } from "./services/logger/logger.interface";
import { SERVICE_TYPES } from "./globalTypes";
import { LoggerService } from "./services/logger/logger.service";
import { IExceptionFilter } from "./services/exceptionFIlter/exception.filter.interface";


const appContainer = new Container();
appContainer.bind<ILogger>(SERVICE_TYPES.ILogger).to(LoggerService);
appContainer.bind<IExceptionFilter>(SERVICE_TYPES.IExceptionFilter).to(ExceptionFilter);
appContainer.bind<UsersController>(SERVICE_TYPES.Users).to(UsersController);
appContainer.bind<ExampleController>(SERVICE_TYPES.Example).to(ExampleController);
appContainer.bind<App>(SERVICE_TYPES.Application).to(App);
const app = appContainer.get<App>(SERVICE_TYPES.Application);

app.init();

export { app, appContainer };
