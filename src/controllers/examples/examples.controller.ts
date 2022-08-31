import { Entity } from "./example.interface";
import { NextFunction, Request, Response } from 'express';
import { BaseController } from "../baseController/base.controller";
import { LoggerService } from "services/logger/logger.service";
import { ROUTE_NAME } from "globalConstants";
import { HTTPError } from "../../services/exceptionFIlter/http-error.class";


export const exampleObject: Record<string, Entity> = {
  // todo mock
  '1': {
    id: 1,
    name: 'Example',
  },
};

export class ExampleController extends BaseController {
  constructor(logger: LoggerService, context: ROUTE_NAME) {
    super(logger, context);
    this.bindRouter([{
      method: 'get',
      path: '/',
      func: this.getAllExamples,
    },
    {
      method: 'get',
      path: '/:id',
      func: this.getExampleById,
    },
    {
      method: 'post',
      path: '/',
      func: this.createExample,
    },
    {
      method: 'delete',
      path: '/:id',
      func: this.deleteExample,
    },
    {
      method: 'put',
      path: '/',
      func: this.updateExample,
    },
    ], this.context);
  }

  getAllExamples(request: Request, response: Response) {
    this.send(response, 200, exampleObject);
  }

  getExampleById(request: Request<{ id: string }>, response: Response, next: NextFunction) {
    const { id } = request.params;
    if (id in exampleObject) {
      this.send(response, 200, exampleObject[id]);
      return;
    }
    next(new HTTPError(404, 'Примера по данному id не найдено', this.context));
  }

  createExample(request: Request<any, any, Entity>, response: Response, next: NextFunction) {
    const { body } = request;
    if ('name' in body) {
      const id = -new Date();
      const result = { ...body, id };
      exampleObject[id] = result;
      this.send(response, 201, result);
      return;
    }
    next(new HTTPError(400, 'Для создания примера необходимо ввести название', this.context));
  }

  deleteExample(request: Request<{ id: string }>, response: Response, next: NextFunction) {
    const { id } = request.params;
    if (id in exampleObject) {
      delete exampleObject[id];
      this.ok(response, { id });
      return;
    }
    next(new HTTPError(400, 'Не получилось удалить, так как пользователь не существует', this.context));
  }

  updateExample(request: Request<any, Entity, Entity>, response: Response, next: NextFunction) {
    const { body } = request;
    if ('id' in body && 'name' in body) {
      if (exampleObject[body.id]) {
        (exampleObject[body.id] as Entity).name = body.name;
        this.ok(response, exampleObject[body.id]);
        return;
      }
      next(new HTTPError(404, 'Не удалось изменить - пользователь не найден', this.context));
      return;
    }
    next(new HTTPError(400, 'Для редактирования необходимо ввести id и name', this.context));
  }
}


