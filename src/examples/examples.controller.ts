import { Entity } from "./example.interface";
import { Request, Response } from 'express';
import { BaseController } from "../baseController/base.controller";
import { LoggerService } from "../logger/logger.service";


export const exampleObject: Record<string, Entity> = {
  // todo mock
  '1': {
    id: 1,
    name: 'Example',
  },
};

export class ExampleController extends BaseController {
  constructor(logger: LoggerService) {
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
      path: '/',
      func: this.updateExample,
    },
    ]);
  }

  getAllExamples(request: Request, response: Response) {
    this.send(response, 200, exampleObject);
  }

  getExampleById(request: Request<{ id: string }>, response: Response) {
    const { id } = request.params;
    if (id in exampleObject) {
      this.send(response, 200, exampleObject[id]);
      return;
    }
    response.sendStatus(404);
  }

  createExample(request: Request<any, any, Entity>, response: Response) {
    const { body } = request;
    if ('id' in body && 'name' in body) {
      exampleObject[body.id] = body;
      this.send(response, 201, body);
      return;
    }
    response.sendStatus(400);
  }

  deleteExample(request: Request<{ id: string }>, response: Response) {
    const { id } = request.params;
    if (id in exampleObject) {
      delete exampleObject[id];
      this.ok(response, { id });
      return;
    }
    response.sendStatus(404);
  }

  updateExample(request: Request<any, Entity, Entity>, response: Response) {
    const { body } = request;
    if ('id' in body && 'name' in body) {
      if (exampleObject[body.id]) {
        (exampleObject[body.id] as Entity).name = body.name;
        this.ok(response, exampleObject[body.id]);
        return;
      }
      response.sendStatus(400);
      return;
    }
    response.sendStatus(404);
  }
}


