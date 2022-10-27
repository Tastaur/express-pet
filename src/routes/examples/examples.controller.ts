import { NextFunction, Request, Response } from 'express';
import { BaseController } from "../../common/baseController/base.controller";
import { ROUTE_NAME } from "../../globalConstants";
import { HTTPError } from "../../common/exceptionFIlter/http-error.class";
import { SERVICE_TYPES, WithId } from "../../globalTypes";
import { ILogger } from "../../common/logger/logger.interface";
import { inject, injectable } from "inversify";
import 'reflect-metadata';
import { CreateExampleDto, UpdateExampleDto } from "./dto";
import { IExampleController } from "./interfaces/example.controller.interface";
import { IExampleService } from "./interfaces/example.service.interface";
import { ValidateMiddleware } from "../../common/middelwares/validateMiddleware";
import { CheckIdMiddleware } from "../../common/middelwares/checkIdMiddleware";


@injectable()
export class ExampleController extends BaseController implements IExampleController {
  context = ROUTE_NAME.EXAMPLE;

  constructor(
    @inject(SERVICE_TYPES.ILogger) private loggerService: ILogger,
    @inject(SERVICE_TYPES.ExampleService) private exampleService: IExampleService,
  ) {
    super(loggerService);
    this.bindRouter([{
      method: 'get',
      path: '/',
      func: this.getAllExamples,
    },
    {
      method: 'get',
      path: '/:id',
      func: this.getExampleById,
      middlewares: [new CheckIdMiddleware(this.context)],
    },
    {
      method: 'post',
      path: '/',
      func: this.createExample,
      middlewares: [new ValidateMiddleware({ classToValidate: CreateExampleDto })],
    },
    {
      method: 'delete',
      path: '/:id',
      func: this.deleteExample,
      middlewares: [new CheckIdMiddleware(this.context)],
    },
    {
      method: 'put',
      path: '/:id',
      func: this.updateExample,
      middlewares: [new ValidateMiddleware({
        classToValidate: CreateExampleDto,
        forbiddenEmpty: true,
      }),
      new CheckIdMiddleware(this.context)],
    },
    ], this.context);
  }

  async getAllExamples(request: Request, response: Response) {
    const examples = await this.exampleService.getExamples();
    this.send(response, 200, examples);
  }

  async getExampleById(request: Request<WithId>, response: Response, next: NextFunction) {
    const { id } = request.params;
    const currentExample = await this.exampleService.getExampleById(Number(id));
    if (currentExample) {
      this.send(response, 200, currentExample);
      return;
    }
    next(new HTTPError(404, `Примера по id ${id} не найдено`, this.context));
  }

  async createExample(request: Request<unknown, unknown, CreateExampleDto>, response: Response, next: NextFunction) {
    const { body } = request;
    const newExample = await this.exampleService.createExample(body);
    if (newExample) {
      this.created(response, newExample);
      return;
    }
    next(new HTTPError(400, 'Для создания примера необходимо ввести название', this.context));
  }

  async deleteExample(request: Request<WithId>, response: Response, next: NextFunction) {
    const { id } = request.params;
    const deletedExample = await this.exampleService.deleteExample(Number(id));
    if (deletedExample) {
      this.ok(response, { id: deletedExample.id });
      return;
    }
    next(new HTTPError(400, 'Не получилось удалить, так как пример не существует', this.context));
  }

  async updateExample(request: Request<WithId, unknown, UpdateExampleDto>, response: Response, next: NextFunction) {
    const { body } = request;
    const { id } = request.params;
    const updatedExample = await this.exampleService.updateExample(Number(id), body);
    if (updatedExample) {
      this.ok(response, updatedExample);
      return;
    }
    next(new HTTPError(404, 'Не удалось изменить - пользователь не найден', this.context));
  }
}


