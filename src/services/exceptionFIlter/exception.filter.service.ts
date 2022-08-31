import { ExceptionFilterInterface } from "./exception.filter.interface";
import { LoggerService } from "../logger/logger.service";
import { HTTPError } from "./http-error.class";
import { Request, Response } from "express";

export class ExceptionFilter implements ExceptionFilterInterface {
  logger: LoggerService;

  constructor(logger: LoggerService) {
    this.logger = logger;
  }

  catch = (error: Error | HTTPError, req: Request, res: Response) => {
    if (error instanceof HTTPError) {
      const { context, message, statusCode } = error;
      this.logger.error(`${context ? `[${context}]` : ''}: ${statusCode}: ${message}`);
    } else {
      this.logger.log(error.message);
    }
    res.status(500).json({ err: error.message });
  };
}