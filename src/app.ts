import express, { Express } from "express";
import { Server } from "http";
import { LoggerService } from "./logger/logger.service";
import { ExampleController } from "./examples/examples.controller";
import { ExceptionFilter } from "./exceptionFIlter/exception.filter";

interface AppServices {
  logger: LoggerService;
  example: ExampleController;
  exceptionFilter: ExceptionFilter;
}

export class App {
  app: Express;
  port: number | string;
  server: Server;
  logger: LoggerService;
  example: ExampleController;
  exceptionFilter: ExceptionFilter;

  constructor(service: AppServices) {
    this.app = express();
    this.port = process.env.PORT || 3005;
    this.app.use(express.json());
    this.logger = service.logger;
    this.example = service.example;
    this.exceptionFilter = service.exceptionFilter;
  }


  useExceptionFilter = () => {
    this.app.use(this.exceptionFilter.catch.bind(this.exceptionFilter));
  };

  useRoutes = () => {
    this.app.use('/example', this.example.router);
  };

  public init = async () => {
    this.useRoutes();
    this.useExceptionFilter();
    this.server = this.app.listen(this.port);
    this.logger.log(`Запущено`);
  };
}