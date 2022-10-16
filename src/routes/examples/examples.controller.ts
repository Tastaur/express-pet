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
import { ExampleEntityDto } from "./dto/example.dto";
import { IExampleService } from "./interfaces/example.service.interface";
import { ValidateMiddleware } from "../../common/middelwares/validateMiddleware";

// todo mock
export const exampleObject: Record<string, ExampleEntityDto> = {
  '1': {
    id: 1,
    name: 'Example',
  },
};

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
    },
    {
      method: 'put',
      path: '/:id',
      func: this.updateExample,
      middlewares: [new ValidateMiddleware({
        classToValidate: CreateExampleDto,
        forbiddenEmpty: true,
      })],
    },
    ], this.context);
  }

  async getAllExamples(request: Request, response: Response) {
    const examples = await this.exampleService.getExamples();
    this.send(response, 200, examples);
  }

  async getExampleById(request: Request<WithId>, response: Response, next: NextFunction) {
    const { id } = request.params;
    const currentExample = await this.exampleService.getExampleById(id);
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
    const deletedId = await this.exampleService.deleteExample(id);
    if (deletedId) {
      this.ok(response, { id: deletedId });
      return;
    }
    next(new HTTPError(400, 'Не получилось удалить, так как пример не существует', this.context));
  }

  async updateExample(request: Request<WithId, unknown, UpdateExampleDto>, response: Response, next: NextFunction) {
    const { body } = request;
    const { id } = request.params;
    const updatedExample = await this.exampleService.updateExample(id, body);
    if (updatedExample) {
      this.ok(response, updatedExample);
      return;
    }
    next(new HTTPError(404, 'Не удалось изменить - пользователь не найден', this.context));
  }
}


