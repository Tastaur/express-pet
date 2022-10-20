import express, { Express } from "express";
import { Server } from "http";
import { ENV_KEY, ROUTE_NAME } from "./globalConstants";
import { ILogger } from "common/logger/logger.interface";
import { inject, injectable } from "inversify";
import { SERVICE_TYPES } from "./globalTypes";
import { IExceptionFilter } from "common/exceptionFIlter/exception.filter.interface";
import 'reflect-metadata';
import { IUserController } from "./routes/users/interfaces/user.controller.interface";
import { IExampleController } from "./routes/examples/interfaces/example.controller.interface";
import { IPetsController } from "./routes/pets/interfaces/pets.controller.interface";
import { IConfigService } from "./common/configService/config.service.interface";
import { PrismaService } from "./database/prisma.service";


@injectable()
export class App {
  app: Express;
  port: number | string;
  server: Server;

  constructor(
    @inject(SERVICE_TYPES.ILogger) private logger: ILogger,
    @inject(SERVICE_TYPES.IExceptionFilter) private exceptionFilter: IExceptionFilter,
    @inject(SERVICE_TYPES.UsersController) private users: IUserController,
    @inject(SERVICE_TYPES.ExampleController) private example: IExampleController,
    @inject(SERVICE_TYPES.PetsController) private pets: IPetsController,
    @inject(SERVICE_TYPES.IConfigService) private config: IConfigService,
    @inject(SERVICE_TYPES.PrismaService) private prismaService: PrismaService,
  ) {
    this.app = express();
    this.port = this.config.get(ENV_KEY.PORT) || 3005;
    this.app.use(express.json());
  }

  useRoutes() {
    Object.values(ROUTE_NAME).forEach(route => {
      this.app.use(`/${route}`, this[route].router);
    });
  }

  useExceptionFilter() {
    this.app.use(this.exceptionFilter.catch);
  }

  public init = async () => {
    this.useRoutes();
    this.useExceptionFilter();
    this.server = this.app.listen(this.port);
    this.logger.log(`Запущено: ${this.port}`);
    await this.prismaService.connection();
  };
}