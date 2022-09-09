import { NextFunction, Request, Response } from 'express';
import { BaseController } from "../../services/baseController/base.controller";
import { ROUTE_NAME } from "../../globalConstants";
import { HTTPError } from "../../services/exceptionFIlter/http-error.class";
import { WithId } from "../../globalTypes";
import { ILogger } from "../../services/logger/logger.interface";
import { injectable } from "inversify";
import 'reflect-metadata';
import { IExampleController } from "./example.controller.interface";
import { CreateExampleDto, ExampleDto, UpdateExampleDto } from "./dto";
import { getArrayFromRecord } from "../../utils/getArrayFromRecord";

// todo mock
export const exampleObject: Record<string, ExampleDto> = {
  '1': {
    id: '1',
    name: 'Example',
  },
};

@injectable()
export class ExampleController extends BaseController implements IExampleController {
  context = ROUTE_NAME.EXAMPLE;

  constructor(logger: ILogger) {
    super(logger);
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
      path: '/:id',
      func: this.updateExample,
    },
    ], this.context);
  }

  getAllExamples(request: Request, response: Response) {
    this.send(response, 200, getArrayFromRecord(exampleObject));
  }

  getExampleById(request: Request<WithId>, response: Response, next: NextFunction) {
    const { id } = request.params;
    if (id in exampleObject) {
      this.send(response, 200, exampleObject[id]);
      return;
    }
    next(new HTTPError(404, `Примера по id ${id} не найдено`, this.context));
  }

  createExample(request: Request<unknown, unknown, CreateExampleDto>, response: Response, next: NextFunction) {
    const { body } = request;
    if ('name' in body) {
      const id = String(-new Date());
      const result = { ...body, id };
      exampleObject[id] = result;
      this.created(response, result);
      return;
    }
    next(new HTTPError(400, 'Для создания примера необходимо ввести название', this.context));
  }

  deleteExample(request: Request<WithId>, response: Response, next: NextFunction) {
    const { id } = request.params;
    if (id in exampleObject) {
      delete exampleObject[id];
      this.ok(response, { id });
      return;
    }
    next(new HTTPError(400, 'Не получилось удалить, так как пользователь не существует', this.context));
  }

  updateExample(request: Request<WithId, unknown, UpdateExampleDto>, response: Response, next: NextFunction) {
    const { body } = request;
    const { id } = request.params;
    if (exampleObject[id]) {
      if ('name' in body) {
        exampleObject[id]!.name = body.name;
        this.ok(response, exampleObject[id]);
        return;
      }
      next(new HTTPError(400, 'Для редактирования необходимо ввести name', this.context));
      return;
    }
    next(new HTTPError(404, 'Не удалось изменить - пользователь не найден', this.context));

  }
}


