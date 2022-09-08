import { NextFunction, Request, Response } from "express";
import { WithId } from "globalTypes";
import { IBaseController } from "services/baseController/base.controller.interface";
import { IPetModel } from "controllers/pets/pet.interface";

export interface IPetsController extends IBaseController {
  getPets: (request: Request<unknown, unknown, unknown,
    {hasTail: string}>, response: Response, next: NextFunction) => void;
  getPetById: (request: Request<WithId>, response: Response, next: NextFunction) => void;
  createPet: (request: Request, response: Response, next: NextFunction) => void;
  deletePet: (request: Request<WithId>, response: Response, next: NextFunction) => void;
  updatePet: (request: Request<WithId, IPetModel, IPetModel>, response: Response, next: NextFunction) => void;
}