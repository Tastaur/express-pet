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
import { IExampleService } from "./routes/examples/interfaces/example.service.interface";
import { ExampleService } from "./routes/examples/example.service";
import { ConfigService } from "./common/configService/config.service";
import { IConfigService } from "./common/configService/config.service.interface";
import { PrismaService } from "./database/prisma.service";
import { UserRepository } from "./routes/users/user.repository";
import { IUserRepository } from "./routes/users/interfaces/user.repository.interface";
import { IPetsRepository } from "./routes/pets/interfaces/pets.repository.interface";
import { PetsRepository } from "./routes/pets/pets.repository";


const appBindings = new ContainerModule((bind) => {
  bind<ILogger>(SERVICE_TYPES.ILogger).to(LoggerService).inSingletonScope();
  bind<IConfigService>(SERVICE_TYPES.IConfigService).to(ConfigService).inSingletonScope();
  bind<IExceptionFilter>(SERVICE_TYPES.IExceptionFilter).to(ExceptionFilter).inSingletonScope();
  bind<PrismaService>(SERVICE_TYPES.PrismaService).to(PrismaService).inSingletonScope();

  bind<IUserController>(SERVICE_TYPES.UsersController).to(UsersController);
  bind<IUserService>(SERVICE_TYPES.UsersService).to(UserService);
  bind<IUserRepository>(SERVICE_TYPES.UserRepository).to(UserRepository);

  bind<IPetsController>(SERVICE_TYPES.PetsController).to(PetsController);
  bind<IPetsService>(SERVICE_TYPES.PetsService).to(PetsService);
  bind<IPetsRepository>(SERVICE_TYPES.PetsRepository).to(PetsRepository);

  bind<IExampleController>(SERVICE_TYPES.ExampleController).to(ExampleController);
  bind<IExampleService>(SERVICE_TYPES.ExampleService).to(ExampleService);

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
