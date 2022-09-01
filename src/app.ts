import express, { Express } from "express";
import { Server } from "http";
import { ExampleController } from "controllers/examples/examples.controller";
import { ROUTE_NAME } from "./globalConstants";
import { ExceptionFilter } from "services/exceptionFIlter/exception.filter.service";
import { UsersController } from "controllers/users/users.controller";
import { ILogger } from "services/logger/logger.interface";

interface AppServices {
  logger: ILogger;
  example: ExampleController;
  users: UsersController;
  exceptionFilter: ExceptionFilter;
}

export class App {
  app: Express;
  port: number | string;
  server: Server;
  logger: ILogger;
  example: ExampleController;
  exceptionFilter: ExceptionFilter;
  users: UsersController;

  constructor(service: AppServices) {
    this.app = express();
    this.port = process.env.PORT || 3003;
    this.app.use(express.json());
    this.logger = service.logger;
    this.example = service.example;
    this.users = service.users;
    this.exceptionFilter = service.exceptionFilter;
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