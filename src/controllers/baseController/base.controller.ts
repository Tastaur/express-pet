import { Request, Response, Router } from "express";

import { BaseRouterInterface } from "./base.router.interface";
import { ROUTE_NAME } from "../../globalConstants";
import { ILogger } from "../../services/logger/logger.interface";
import { inject, injectable } from "inversify";
import { SERVICE_TYPES } from "../../globalTypes";
import 'reflect-metadata';

@injectable()
export class BaseController {
  private readonly _router: Router;

  constructor(@inject(SERVICE_TYPES.ILogger) private logger: ILogger) {
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
    RS extends Response = Response>(routes: BaseRouterInterface<RQ, RS>[], context: ROUTE_NAME) {
    for (const { func, method, path } of routes) {
      this.logger.log(`Подкюлчен: [${context}] ${method.toLocaleUpperCase()} ${path}`);
      // @ts-ignore
      this.router[method](path, func.bind(this));
    }
  }
}