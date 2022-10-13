import { NextFunction, Request, Response } from "express";
import { WithId } from "globalTypes";
import { IBaseController } from "common/baseController/base.controller.interface";
import { UpdateUserDto } from "routes/users/dto";


export interface IUserController extends IBaseController {
  getUsers: (request: Request, response: Response, next: NextFunction) => void;
  getUserById: (request: Request<WithId>, response: Response, next: NextFunction) => void;
  createUser: (request: Request, response: Response, next: NextFunction) => void;
  deleteUser: (request: Request<WithId>, response: Response, next: NextFunction) => void;
  updateUser: (request: Request<WithId, unknown, UpdateUserDto>, response: Response, next: NextFunction) => void;
}