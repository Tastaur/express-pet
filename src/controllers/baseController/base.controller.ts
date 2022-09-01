import { Request, Response, Router } from "express";

import { BaseRouterInterface } from "./base.router.interface";
import { ROUTE_NAME } from "globalConstants";
import { ILogger } from "services/logger/logger.interface";

export class BaseController {
  private readonly _router: Router;
  protected readonly context: ROUTE_NAME;

  constructor(private logger: ILogger, context: ROUTE_NAME) {
    this._router = Router();
    this.context = context;
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