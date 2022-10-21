import { IMiddleware } from "./interface/middleware.interface";
import { NextFunction, Request, Response } from "express";
import { checkIdIsNumber } from "../../utils/checkIdIsNumber";
import { HTTPError } from "../exceptionFIlter/http-error.class";


export class CheckIdMiddleware implements IMiddleware {
  constructor(private context: string) {
  }

  execute(request: Request, res: Response, next: NextFunction) {
    if (request.params.id) {
      const parsedId = checkIdIsNumber(request.params.id);
      if (parsedId) {
        next();
        return;
      }
      next(new HTTPError(404, `Введён некорректный id`, this.context));
      return;
    }
    next();
  }
}