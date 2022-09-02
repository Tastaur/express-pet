import { IExceptionFilter } from "./exception.filter.interface";
import { HTTPError } from "./http-error.class";
import { NextFunction, Request, Response } from "express";
import { ILogger } from "../logger/logger.interface";
import { inject, injectable } from "inversify";
import { SERVICE_TYPES } from "../../globalTypes";
import 'reflect-metadata';

@injectable()
export class ExceptionFilter implements IExceptionFilter {
  constructor(@inject(SERVICE_TYPES.ILogger) private logger: ILogger) {
  }

  catch = (error: Error | HTTPError, req: Request, res: Response, _next: NextFunction) => {
    if (error instanceof HTTPError) {
      const { context, message, statusCode } = error;
      this.logger.error(`${context ? `[${context}]` : ''}: ${statusCode}: ${message}`);
      res.status(error.statusCode).json({ error: error.message });
    } else {
      this.logger.log(error.message);
      res.status(500).json({ err: error.message });
    }
  };
}