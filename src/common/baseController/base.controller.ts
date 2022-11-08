import { Response, Router } from "express";

import { BaseRouterInterface } from "./base.router.interface";
import { ROUTE_NAME } from "../../globalConstants";
import { ILogger } from "../logger/logger.interface";
import { inject, injectable } from "inversify";
import 'reflect-metadata';
import { IBaseController } from "./base.controller.interface";
import { SERVICE_TYPES } from "../../globalTypes";


@injectable()
export class BaseController implements IBaseController {
  private readonly _router: Router;

  constructor(@inject(SERVICE_TYPES.ILogger) private logger: ILogger) {
    this._router = Router();
  }

  get router() {
    return this._router;
  }

  public send<T>(res: Response, code: number, message: T) {
    return res
      .contentType('application/json')
      .status(code)
      .json(message);
  }

  public ok<T>(res: Response, message: T) {
    return this.send<T>(res, 200, message);
  }

  public created<T>(res: Response, message: T) {
    return this.send(res, 201, message);
  }

  protected bindRouter(routes: BaseRouterInterface[], context: ROUTE_NAME) {
    for (const { func, method, path, middlewares } of routes) {
      this.logger.log(`Launch: [${context}] ${method.toLocaleUpperCase()} ${path}`);
      const boundMiddlewares = middlewares?.map(m => m.execute.bind(m));
      const boundFunction = func.bind(this);
      this.router[method](path, boundMiddlewares ? [...boundMiddlewares, boundFunction] : boundFunction);
    }
  }
}
