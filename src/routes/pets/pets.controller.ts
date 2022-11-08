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
import { CheckIdMiddleware } from "../../common/middelwares/checkIdMiddleware";
import { getHTTPErrorWithContext } from "../../utils/getHTTPErrorWithContext";


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

  getPets = async (request: Request<unknown, unknown, unknown, { hasTail?: string }>, response: Response) => {
    const { hasTail } = request.query;
    const pets = await this.petService.getPets(hasTail);
    this.send(response, 200, pets);
  };

  getPetById = async (request: Request<WithId>, response: Response, next: NextFunction) => {
    const { id } = request.params;
    const data = await this.petService.getPetById(Number(id));
    if (data instanceof HTTPError) {
      next(getHTTPErrorWithContext(data, this.context));
      return;
    }
    this.send(response, 200, data);
  };

  createPet = async (request: Request<unknown, unknown, CreatePetDto>, response: Response, next: NextFunction) => {
    const { body } = request;
    const data = await this.petService.createPet(body);
    if (data instanceof HTTPError) {
      next(getHTTPErrorWithContext(data, this.context));
      return;
    }
    this.created(response, data);
  };

  deletePet = async (request: Request<WithId>, response: Response, next: NextFunction) => {
    const { id } = request.params;
    const data = await this.petService.deletePet(Number(id));
    if (data instanceof HTTPError) {
      next(getHTTPErrorWithContext(data, this.context));
      return;
    }
    this.ok(response, { id: data.id });
  };

  updatePet = async (request: Request<WithId, UpdatePetDto, UpdatePetDto>,
    response: Response, next: NextFunction) => {
    const { body } = request;
    const { id } = request.params;
    const data = await this.petService.updatePet(Number(id), body);
    if (data instanceof HTTPError) {
      next(getHTTPErrorWithContext(data, this.context));
      return;
    }
    this.ok(response, data);
  };
}


