import { NextFunction, Request, Response } from 'express';
import { BaseController } from "../../services/baseController/base.controller";
import { ROUTE_NAME } from "../../globalConstants";
import { HTTPError } from "../../services/exceptionFIlter/http-error.class";
import { WithId } from "../../globalTypes";
import { injectable } from "inversify";
import { ILogger } from "../../services/logger/logger.interface";
import 'reflect-metadata';
import { IPetsController } from "./pets.controller.interface";
import { CreatePetDto, PetDto, UpdatePetDto } from "./dto";
import { getArrayFromRecord } from "../../utils/getArrayFromRecord";


export const petMockObjects: Record<string, PetDto> = {
  // todo mock
  '1': new PetDto({
    id: 1,
    name: 'Dog',
    hasTail: true,
  }),
  '2': new PetDto({
    id: 2,
    name: 'Fish',
    hasTail: false,
  }),
};

@injectable()
export class PetsController extends BaseController implements IPetsController {
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

  getPets(request: Request<unknown, unknown, unknown, { hasTail: string }>, response: Response) {
    const { hasTail } = request.query;
    if ('true' === hasTail) {
      this.send(response, 200, getArrayFromRecord(petMockObjects)
        .filter(item => item.hasTail).map(item => item.plainObject));
      return;
    }
    if ('false' === hasTail) {
      this.send(response, 200, getArrayFromRecord(petMockObjects)
        .filter(item => !item.hasTail).map(item => item.plainObject));
      return;
    }
    this.send(response, 200, getArrayFromRecord(petMockObjects).map(item => item.plainObject));
  }

  getPetById(request: Request<WithId>, response: Response, next: NextFunction) {
    const { id } = request.params;
    if (id in petMockObjects) {
      this.send(response, 200, petMockObjects[id]?.plainObject);
      return;
    }
    next(new HTTPError(404, `Домашний питомец по id ${id} не найден`, this.context));
  }

  createPet(request: Request<unknown, unknown, CreatePetDto>, response: Response, next: NextFunction) {
    const { body } = request;
    if ('name' in body && 'hasTail' in body) {
      const id = -new Date();
      const result = new PetDto({ ...body, id });
      petMockObjects[id] = result;
      this.created(response, result.plainObject);
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

  updatePet(request: Request<WithId, UpdatePetDto, UpdatePetDto>, response: Response, next: NextFunction) {
    const { body } = request;
    const { id } = request.params;
    if (petMockObjects[id]) {
      if ('hasTail' in body && 'name' in body) {
        petMockObjects[id]?.updatePet(body);
        this.ok(response, petMockObjects[id]?.plainObject);
        return;
      }
      next(new HTTPError(400, 'Для редактирования необходимо  id, name, age', this.context));
      return;
    }
    next(new HTTPError(404, 'Не удалось изменить - питомец не найден', this.context));
  }
}


