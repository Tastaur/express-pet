import { App } from "./app";
import { ExampleController } from "./routes/examples/examples.controller";
import { UsersController } from "./routes/users/users.controller";
import { ExceptionFilter } from "./common/exceptionFIlter/exception.filter.service";
import { Container, ContainerModule } from "inversify";
import { ILogger } from "./common/logger/logger.interface";
import { SERVICE_TYPES } from "./globalTypes";
import { LoggerService } from "./common/logger/logger.service";
import { IExceptionFilter } from "./common/exceptionFIlter/exception.filter.interface";
import { PetsController } from "./routes/pets/pets.controller";
import { IUserController } from "./routes/users/interfaces/user.controller.interface";
import { IExampleController } from "./routes/examples/interfaces/example.controller.interface";
import { IPetsController } from "./routes/pets/interfaces/pets.controller.interface";
import { IUserService } from "./routes/users/interfaces/user.service.interface";
import { UserService } from "./routes/users/user.service";
import { IPetsService } from "./routes/pets/interfaces/pets.service.interface";
import { PetsService } from "./routes/pets/pets.service";


const appBindings = new ContainerModule((bind) => {
  bind<ILogger>(SERVICE_TYPES.ILogger).to(LoggerService);
  bind<IExceptionFilter>(SERVICE_TYPES.IExceptionFilter).to(ExceptionFilter);
  bind<IUserController>(SERVICE_TYPES.UsersController).to(UsersController);
  bind<IExampleController>(SERVICE_TYPES.ExampleController).to(ExampleController);
  bind<IPetsController>(SERVICE_TYPES.PetsController).to(PetsController);
  bind<IUserService>(SERVICE_TYPES.UsersService).to(UserService);
  bind<IPetsService>(SERVICE_TYPES.PetsService).to(PetsService);
  bind<App>(SERVICE_TYPES.Application).to(App);
});


const bootstrap = () => {
  const appContainer = new Container();
  appContainer.load(appBindings);
  const app = appContainer.get<App>(SERVICE_TYPES.Application);
  app.init();
  return { appContainer, app };
};


export const { app, appContainer } = bootstrap();
