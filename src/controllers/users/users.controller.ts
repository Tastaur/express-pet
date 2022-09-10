import { NextFunction, Request, Response } from 'express';
import { BaseController } from "../../services/baseController/base.controller";
import { ROUTE_NAME } from "../../globalConstants";
import { HTTPError } from "../../services/exceptionFIlter/http-error.class";
import { WithId } from "globalTypes";
import { injectable } from "inversify";
import { ILogger } from "../../services/logger/logger.interface";
import 'reflect-metadata';
import { getArrayFromRecord } from "../../utils/getArrayFromRecord";
import { CreateUserDto, UpdateUserDto, UserDto } from "./dto";
import { IUserController } from "./user.controller.interface";

// todo mock
export const usersObject: Record<string, UserDto> = {
  '1': new UserDto({
    id: 1,
    name: 'Name',
    email: 'email',
    age: 24,
  }),
};

@injectable()
export class UsersController extends BaseController implements IUserController{
  context = ROUTE_NAME.USERS;
  constructor(logger: ILogger) {
    super(logger);
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
      path: '/:id',
      func: this.updateUser,
    },
    ], this.context);
  }

  getUsers(request: Request, response: Response) {
    this.send(response, 200, getArrayFromRecord(usersObject).map(item => item.plainObject));
  }

  getUserById(request: Request<WithId>, response: Response, next: NextFunction) {
    const { id } = request.params;
    if (usersObject[id]) {
      this.send(response, 200, usersObject[id]?.plainObject);
      return;
    }
    next(new HTTPError(404, 'Пользователь по данному id не найдено', this.context));
  }

  createUser(request: Request<unknown, unknown, CreateUserDto>, response: Response, next: NextFunction) {
    const { body } = request;
    if ('name' in body && 'age' in body) {
      const newUser = new UserDto(body);
      usersObject[newUser.id] = newUser;
      this.created(response, newUser.plainObject);
      return;
    }
    next(new HTTPError(400, 'Для создания пользователя надо ввести age и name', this.context));
  }

  deleteUser(request: Request<WithId>, response: Response, next: NextFunction) {
    const { id } = request.params;
    if (id in usersObject) {
      delete usersObject[id];
      this.ok(response, { id });
      return;
    }
    next(new HTTPError(404, `Пользователь по id ${id} не найден`, this.context));
  }

  updateUser(request: Request<WithId, unknown, UpdateUserDto>, response: Response, next: NextFunction) {
    const { body } = request;
    const { id } = request.params;
    if (usersObject[id]) {
      if ('name' in body && 'age' in body && 'email' in body) {
        usersObject[id]!.updateUser(body);
        this.ok(response, usersObject[id]?.plainObject);
        return;
      }
      next(new HTTPError(400, 'Не заполнены поля name и age', this.context));
      return;
    }
    next(new HTTPError(404, 'Не удалось изменить - пользователь не найден', this.context));
      
  }
}


