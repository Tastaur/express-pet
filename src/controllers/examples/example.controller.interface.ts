import { NextFunction, Request, Response } from "express";
import { WithId } from "globalTypes";
import { IBaseController } from "services/baseController/base.controller.interface";
import { IPetModel } from "controllers/pets/pet.interface";
import { Entity } from "controllers/examples/example.interface";

export interface IExampleController extends IBaseController {
  getAllExamples: (request: Request, response: Response, next: NextFunction) => void;
  getExampleById: (request: Request<WithId>, response: Response, next: NextFunction) => void;
  createExample: (request: Request, response: Response, next: NextFunction) => void;
  deleteExample: (request: Request<WithId>, response: Response, next: NextFunction) => void;
  updateExample: (request: Request<unknown, Entity, Entity>, response: Response, next: NextFunction) => void;
}