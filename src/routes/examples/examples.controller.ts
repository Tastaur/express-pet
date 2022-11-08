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
import { getHTTPErrorWithContext } from "../../utils/getHTTPErrorWithContext";


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

  getAllExamples = async (request: Request, response: Response) => {
    const examples = await this.exampleService.getExamples();
    this.send(response, 200, examples);
  };

  getExampleById = async (request: Request<WithId>, response: Response, next: NextFunction) => {
    const { id } = request.params;
    const data = await this.exampleService.getExampleById(Number(id));
    if (data instanceof HTTPError) {
      next(getHTTPErrorWithContext(data, this.context));
      return;
    }
    this.send(response, 200, data);
  };

  createExample = async (request: Request<unknown, unknown, CreateExampleDto>,
    response: Response, next: NextFunction) => {
    const { body } = request;
    const data = await this.exampleService.createExample(body);
    if (data instanceof HTTPError) {
      next(getHTTPErrorWithContext(data, this.context));
      return;
    }
    this.created(response, data);
  };

  deleteExample = async (request: Request<WithId>, response: Response, next: NextFunction) => {
    const { id } = request.params;
    const data = await this.exampleService.deleteExample(Number(id));
    if (data instanceof HTTPError) {
      next(getHTTPErrorWithContext(data, this.context));
      return;
    }
    this.ok(response, { id: data.id });
  };

  updateExample = async (request: Request<WithId, unknown, UpdateExampleDto>,
    response: Response, next: NextFunction) => {
    const { body } = request;
    const { id } = request.params;
    const data = await this.exampleService.updateExample(Number(id), body);
    if (data instanceof HTTPError) {
      next(getHTTPErrorWithContext(data, this.context));
      return;
    }
    this.ok(response, data);
  };
}


