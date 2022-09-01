import { ExceptionFilterInterface } from "./exception.filter.interface";
import { HTTPError } from "./http-error.class";
import { Request, Response } from "express";
import { ILogger } from "services/logger/logger.interface";

export class ExceptionFilter implements ExceptionFilterInterface {
  logger: ILogger;

  constructor(logger: ILogger) {
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