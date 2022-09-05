import { App } from "./app";
import { ExampleController } from "./controllers/examples/examples.controller";
import { UsersController } from "./controllers/users/users.controller";
import { ExceptionFilter } from "./services/exceptionFIlter/exception.filter.service";
import { Container, ContainerModule } from "inversify";
import { ILogger } from "./services/logger/logger.interface";
import { SERVICE_TYPES } from "./globalTypes";
import { LoggerService } from "./services/logger/logger.service";
import { IExceptionFilter } from "./services/exceptionFIlter/exception.filter.interface";
import { PetsController } from "./controllers/pets/pets.controller";


const appBindings = new ContainerModule((bind)=>{
  bind<ILogger>(SERVICE_TYPES.ILogger).to(LoggerService);
  bind<IExceptionFilter>(SERVICE_TYPES.IExceptionFilter).to(ExceptionFilter);
  bind<UsersController>(SERVICE_TYPES.Users).to(UsersController);
  bind<ExampleController>(SERVICE_TYPES.Example).to(ExampleController);
  bind<PetsController>(SERVICE_TYPES.Pets).to(PetsController);
  bind<App>(SERVICE_TYPES.Application).to(App);
});


const bootstrap = () =>{
  const appContainer = new Container();
  appContainer.load(appBindings);
  const app = appContainer.get<App>(SERVICE_TYPES.Application);
  app.init();
  return { appContainer, app };
};


export const { app, appContainer } = bootstrap();
