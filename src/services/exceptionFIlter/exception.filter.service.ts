import { ExceptionFilterInterface } from "./exception.filter.interface";
import { HTTPError } from "./http-error.class";
import { NextFunction, Request, Response } from "express";
import { ILogger } from "../logger/logger.interface";
import { LoggerDecorator } from "../logger/logger.decorator";

@LoggerDecorator
export class ExceptionFilter implements ExceptionFilterInterface {
  logger: ILogger;
  constructor() {
  }

  catch = (error: Error | HTTPError, req: Request, res: Response, next: NextFunction) => {
    if (error instanceof HTTPError) {
      const { context, message, statusCode } = error;
      this.logger.error(`${context ? `[${context}]` : ''}: ${statusCode}: ${message}`);
    } else {
      this.logger.log(error.message);
    }
    res.status(500).json({ err: error.message });
    next();
  };
}