import { NextFunction, Request, Response } from 'express';
import { BaseController } from "../../services/baseController/base.controller";
import { ROUTE_NAME } from "../../globalConstants";
import { HTTPError } from "../../services/exceptionFIlter/http-error.class";
import { WithId } from "../../globalTypes";
import { injectable } from "inversify";
import { ILogger } from "../../services/logger/logger.interface";
import 'reflect-metadata';
import { IPetsController } from "controllers/pets/pets.controller.interface";
import { CreatePetDto, PetDto, UpdatePetDto } from "controllers/pets/dto";
import { getArrayFromRecord } from "../../utils/getArrayFromRecord";


export const petMockObjects: Record<string, PetDto> = {
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
      this.send(response, 200, getArrayFromRecord(petMockObjects).filter(item => item.hasTail));
      return;
    }
    if ('false' === hasTail) {
      this.send(response, 200, getArrayFromRecord(petMockObjects).filter(item => !item.hasTail));
      return;
    }
    this.send(response, 200, getArrayFromRecord(petMockObjects));
  }

  getPetById(request: Request<WithId>, response: Response, next: NextFunction) {
    const { id } = request.params;
    if (id in petMockObjects) {
      this.send(response, 200, petMockObjects[id]);
      return;
    }
    next(new HTTPError(404, `Домашний питомец по id ${id} не найден`, this.context));
  }

  createPet(request: Request<unknown, unknown, CreatePetDto>, response: Response, next: NextFunction) {
    const { body } = request;
    if ('name' in body && 'hasTail' in body) {
      const id = -new Date();
      const result = { ...body, id };
      petMockObjects[id] = result;
      this.created(response, result);
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
        petMockObjects[id] = { id: Number(id), ...body };
        this.ok(response, petMockObjects[id]);
        return;
      }
      next(new HTTPError(400, 'Для редактирования необходимо  id, name, age', this.context));
      return;
    }
    next(new HTTPError(404, 'Не удалось изменить - питомец не найден', this.context));
  }
}


