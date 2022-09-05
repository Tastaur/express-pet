import express, { Express } from "express";
import { Server } from "http";
import { ExampleController } from "./controllers/examples/examples.controller";
import { ROUTE_NAME } from "./globalConstants";
import { UsersController } from "./controllers/users/users.controller";
import { ILogger } from "./services/logger/logger.interface";
import { inject, injectable } from "inversify";
import { SERVICE_TYPES } from "./globalTypes";
import { IExceptionFilter } from "./services/exceptionFIlter/exception.filter.interface";
import 'reflect-metadata';
import { PetsController } from "./controllers/pets/pets.controller";


@injectable()
export class App {
  app: Express;
  port: number | string;
  server: Server;

  constructor(
    @inject(SERVICE_TYPES.ILogger) private logger: ILogger,
    @inject(SERVICE_TYPES.IExceptionFilter) private exceptionFilter: IExceptionFilter,
    @inject(SERVICE_TYPES.Users) private users: UsersController,
    @inject(SERVICE_TYPES.Example) private example: ExampleController,
    @inject(SERVICE_TYPES.Pets) private pets: PetsController,
  ) {
    this.app = express();
    this.port = process.env.PORT || 3005;
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
  };
}