import { IUserModel } from "./users.interface";
import { NextFunction, Request, Response } from 'express';
import { BaseController } from "../baseController/base.controller";
import { LoggerService } from "services/logger/logger.service";
import { ROUTE_NAME } from "globalConstants";
import { HTTPError } from "../../services/exceptionFIlter/http-error.class";


export const usersObject: Record<string, IUserModel> = {
  // todo mock
  '1': {
    id: 1,
    name: 'First User',
    age: 28,
  },
};

export class UsersController extends BaseController {
  constructor(logger: LoggerService, context: ROUTE_NAME) {
    super(logger, context);
    this.bindRouter([{
      method: 'get',
      path: '/',
      func: this.getUsers,
    },
    {
      method: 'get',
      path: '/:id',
      func: this.getUserById,
    },
    {
      method: 'post',
      path: '/',
      func: this.createUser,
    },
    {
      method: 'delete',
      path: '/:id',
      func: this.deleteUser,
    },
    {
      method: 'put',
      path: '/',
      func: this.updateUser,
    },
    ], this.context);
  }

  getUsers(request: Request, response: Response) {
    this.send(response, 200, usersObject);
  }

  getUserById(request: Request<{ id: string }>, response: Response, next: NextFunction) {
    const { id } = request.params;
    if (id in usersObject) {
      this.send(response, 200, usersObject[id]);
      return;
    }
    next(new HTTPError(404, 'Пользователь по данному id не найдено', this.context));
  }

  createUser(request: Request<any, any, IUserModel>, response: Response, next: NextFunction) {
    const { body } = request;
    if ('name' in body && 'age' in body) {
      const id = -new Date();
      const result = { ...body, id };
      usersObject[id] = result;
      this.send(response, 201, result);
      return;
    }
    next(new HTTPError(400, 'Для создания пользователя надо ввести age и name', this.context));
  }

  deleteUser(request: Request<{ id: string }>, response: Response, next: NextFunction) {
    const { id } = request.params;
    if (id in usersObject) {
      delete usersObject[id];
      this.ok(response, { id });
      return;
    }
    next(new HTTPError(404, `Пользователь по ${id} не найден`, this.context));
  }

  updateUser(request: Request<any, IUserModel, IUserModel>, response: Response, next: NextFunction) {
    const { body } = request;
    if ('id' in body && 'name' in body && 'age' in body) {
      if (usersObject[body.id]) {
        usersObject[body.id] = { ...body };
        this.ok(response, usersObject[body.id]);
        return;
      }
      next(new HTTPError(404, 'Не удалось изменить - пользователь не найден', this.context));
      return;
    }
    next(new HTTPError(400, 'Для редактирования необходимо  id, name, age', this.context));
  }
}


