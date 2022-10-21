import { NextFunction, Request, Response } from 'express';
import { BaseController } from "../../common/baseController/base.controller";
import { ROUTE_NAME } from "../../globalConstants";
import { HTTPError } from "../../common/exceptionFIlter/http-error.class";
import { SERVICE_TYPES, WithId } from "../../globalTypes";
import { inject, injectable } from "inversify";
import { ILogger } from "../../common/logger/logger.interface";
import 'reflect-metadata';
import { IPetsController } from "./interfaces/pets.controller.interface";
import { CreatePetDto, UpdatePetDto } from "./dto";
import { IPetsService } from "./interfaces/pets.service.interface";
import { ValidateMiddleware } from "../../common/middelwares/validateMiddleware";
import { IPetDtoPlainObject } from "./dto/pet.dto";
import { CheckIdMiddleware } from "../../common/middelwares/checkIdMiddleware";


export const petMockObjects: Record<string, IPetDtoPlainObject> = {
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

  constructor(
    @inject(SERVICE_TYPES.ILogger) private loggerService: ILogger,
    @inject(SERVICE_TYPES.PetsService) private petService: IPetsService,
  ) {
    super(loggerService);
    this.bindRouter([{
      method: 'get',
      path: '/',
      func: this.getPets,
    },
    {
      method: 'get',
      path: '/:id',
      func: this.getPetById,
      middlewares: [new CheckIdMiddleware(this.context)],
    },
    {
      method: 'post',
      path: '/',
      func: this.createPet,
      middlewares: [new ValidateMiddleware({
        classToValidate: CreatePetDto,
      })],
    },
    {
      method: 'delete',
      path: '/:id',
      func: this.deletePet,
      middlewares: [new CheckIdMiddleware(this.context)],
    },
    {
      method: 'put',
      path: '/:id',
      func: this.updatePet,
      middlewares: [
        new CheckIdMiddleware(this.context),
        new ValidateMiddleware({
          classToValidate: UpdatePetDto,
          forbiddenEmpty: true,
        })],
    },
    ], this.context);
  }

  async getPets(request: Request<unknown, unknown, unknown, { hasTail?: string }>, response: Response) {
    const { hasTail } = request.query;
    const pets = await this.petService.getPets(hasTail);
    this.send(response, 200, pets);
  }

  async getPetById(request: Request<WithId>, response: Response, next: NextFunction) {
    const { id } = request.params;
    const pet = await this.petService.getPetById(Number(id));
    if (pet) {
      this.send(response, 200, pet);
    } else {
      next(new HTTPError(404, `Домашний питомец по id ${id} не найден`, this.context));
    }
  }

  async createPet(request: Request<unknown, unknown, CreatePetDto>, response: Response, next: NextFunction) {
    const { body } = request;
    const newPet = await this.petService.createPet(body);
    if (newPet) {
      this.created(response, newPet);
    } else {
      next(new HTTPError(422, 'Данный питомец уже существует', this.context));
    }
  }

  async deletePet(request: Request<WithId>, response: Response, next: NextFunction) {
    const { id } = request.params;
    const deletedPet = await this.petService.deletePet(Number(id));
    if (deletedPet) {
      this.ok(response, { id: deletedPet.id });
    } else {
      next(new HTTPError(404, `Питомец по id ${id} не найден`, this.context));
    }
  }

  async updatePet(request: Request<WithId, UpdatePetDto, UpdatePetDto>, response: Response, next: NextFunction) {
    const { body } = request;
    const { id } = request.params;
    const changedPet = await this.petService.updatePet(Number(id), body);
    if (changedPet) {
      this.ok(response, changedPet);
    } else {
      next(new HTTPError(404, 'Не удалось изменить - питомец не найден', this.context));
    }
  }
}


