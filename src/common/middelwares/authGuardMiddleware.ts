import { IMiddleware } from "./interface/middleware.interface";
import { NextFunction, Request, Response } from "express";
import { HTTPError } from "../exceptionFIlter/http-error.class";


export class AuthGuardMiddleware implements IMiddleware {
  constructor(private context: string) {
  }

  execute(req: Request, res: Response, next: NextFunction) {
    if (req.user) {
      next();
    } else {
      next(new HTTPError(401, 'Вы не авторизованы', this.context));
    }
  }
}
