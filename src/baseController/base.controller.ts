import { Request, Response, Router } from "express";
import { LoggerService } from "../logger/logger.service";

import { BaseRouterInterface } from "./base.router.interface";

export class BaseController {
  private readonly _router: Router;

  constructor(private logger: LoggerService) {
    this._router = Router();
  }

  get router() {
    return this._router;
  }

  public send<T>(res: Response, code: number, message: T) {
    return res
      .type('application/json')
      .status(code)
      .json(message);
  }

  public ok<T>(res: Response, message: T) {
    return this.send<T>(res, 200, message);
  }

  public created(res: Response) {
    return res.sendStatus(201);
  }

  protected bindRouter<RQ extends Request = Request,
    RS extends Response = Response>(routes: BaseRouterInterface<RQ, RS>[]) {
    for (const { func, method, path } of routes) {
      this.logger.log(`Подкюлчен: ${method.toLocaleUpperCase()} ${path}`);
      // @ts-ignore
      this.router[method](path, func.bind(this));
    }
  }
}