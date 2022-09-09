import express, { Express } from "express";
import { Server } from "http";
import { ROUTE_NAME } from "./globalConstants";
import { ILogger } from "services/logger/logger.interface";
import { inject, injectable } from "inversify";
import { SERVICE_TYPES } from "./globalTypes";
import { IExceptionFilter } from "services/exceptionFIlter/exception.filter.interface";
import 'reflect-metadata';
import { IUserController } from "controllers/users/user.controller.interface";
import { IPetsController } from "controllers/pets/pets.controller.interface";
import { IExampleController } from "controllers/examples/example.controller.interface";


@injectable()
export class App {
  app: Express;
  port: number | string;
  server: Server;

  constructor(
    @inject(SERVICE_TYPES.ILogger) private logger: ILogger,
    @inject(SERVICE_TYPES.IExceptionFilter) private exceptionFilter: IExceptionFilter,
    @inject(SERVICE_TYPES.Users) private users: IUserController,
    @inject(SERVICE_TYPES.Example) private example: IExampleController,
    @inject(SERVICE_TYPES.Pets) private pets: IPetsController,
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