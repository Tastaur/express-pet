import { IPetModel } from "./pet.interface";
import { NextFunction, Request, Response } from 'express';
import { BaseController } from "../baseController/base.controller";
import { ROUTE_NAME } from "../../globalConstants";
import { HTTPError } from "../../services/exceptionFIlter/http-error.class";
import { WithId } from "../../globalTypes";
import { injectable } from "inversify";
import { ILogger } from "../../services/logger/logger.interface";
import 'reflect-metadata';


export const petMockObjects: Record<string, IPetModel> = {
  // todo mock
  '1': {
    id: 1,
    name: 'Dog',
    hasTail: true,
  },
  '2': {
    id: 2,
    name: 'Fish',
    hasTail: false,
  },
};

@injectable()
export class PetsController extends BaseController {
  context = ROUTE_NAME.PETS;
  constructor(logger: ILogger) {
    super(logger);
    this.bindRouter([{
      method: 'get',
      path: '/',
      func: this.getPets,
    },
    {
      method: 'get',
      path: '/:id',
      func: this.getPetById,
    },
    {
      method: 'post',
      path: '/',
      func: this.createPet,
    },
    {
      method: 'delete',
      path: '/:id',
      func: this.deletePet,
    },
    {
      method: 'put',
      path: '/:id',
      func: this.updatePet,
    },
    ], this.context);
  }

  getPets(request: Request<unknown, unknown, unknown, {hasTail: string}>, response: Response) {
    const { hasTail } = request.query;
    if('true' === hasTail){
      this.send(response, 200, Object.values(petMockObjects).filter(item => item.hasTail));
      return;
    }   
    if('false' === hasTail){
      this.send(response, 200, Object.values(petMockObjects).filter(item => !item.hasTail));
      return;
    }
    this.send(response, 200, petMockObjects);
  }

  getPetById(request: Request<WithId>, response: Response, next: NextFunction) {
    const { id } = request.params;
    if (id in petMockObjects) {
      this.send(response, 200, petMockObjects[id]);
      return;
    }
    next(new HTTPError(404, `Домашний питомец по id ${id} не найден`, this.context));
  }

  createPet(request: Request<unknown, unknown, IPetModel>, response: Response, next: NextFunction) {
    const { body } = request;
    if ('name' in body && 'hasTail' in body) {
      const id = -new Date();
      const result = { ...body, id };
      petMockObjects[id] = result;
      this.send(response, 201, result);
      return;
    }
    next(new HTTPError(400, 'Для создания питомца необходимо ввести hasTail и name', this.context));
  }

  deletePet(request: Request<WithId>, response: Response, next: NextFunction) {
    const { id } = request.params;
    if (id in petMockObjects) {
      delete petMockObjects[id];
      this.ok(response, { id });
      return;
    }
    next(new HTTPError(404, `Питомец по id ${id} не найден`, this.context));
  }

  updatePet(request: Request<WithId, IPetModel, IPetModel>, response: Response, next: NextFunction) {
    const { body: { id: bodyId, ...restBody } } = request;
    const { id } = request.params;
    if (petMockObjects[id]) {
      if ('hasTail' in restBody && 'name' in restBody) {
        petMockObjects[id] = { id: Number(id), ...restBody };
        this.ok(response, petMockObjects[id]);
        return;
      }
      next(new HTTPError(400, 'Для редактирования необходимо  id, name, age', this.context));
      return;
    }
    next(new HTTPError(404, 'Не удалось изменить - питомец не найден', this.context));
  }
}


