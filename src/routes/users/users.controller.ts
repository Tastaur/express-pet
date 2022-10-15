import { NextFunction, Request, Response } from 'express';
import { BaseController } from "../../common/baseController/base.controller";
import { ROUTE_NAME } from "../../globalConstants";
import { HTTPError } from "../../common/exceptionFIlter/http-error.class";
import { SERVICE_TYPES, WithId } from "../../globalTypes";
import { inject, injectable } from "inversify";
import { ILogger } from "../../common/logger/logger.interface";
import 'reflect-metadata';
import { CreateUserDto, UpdateUserDto } from "./dto";
import { IUserController } from "./interfaces/user.controller.interface";
import { IUserService } from "./interfaces/user.service.interface";
import { ValidateMiddleware } from "../../common/middelwares/validateMiddleware";
import { IUserData } from "./dto/user.dto";

// todo mock
export const usersObject: Record<string, IUserData> = {
  '1': {
    id: 1,
    name: 'Name',
    email: 'email',
    age: 24,
    password: 'password',
  },
};

@injectable()
export class UsersController extends BaseController implements IUserController {
  context = ROUTE_NAME.USERS;

  constructor(
    @inject(SERVICE_TYPES.ILogger) private loggerService: ILogger,
    @inject(SERVICE_TYPES.UsersService) private userService: IUserService,
  ) {
    super(loggerService);
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
      middlewares: [new ValidateMiddleware({ classToValidate: CreateUserDto })],
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
      middlewares: [new ValidateMiddleware({ classToValidate: UpdateUserDto, forbiddenEmpty: true })],
    },
    ], this.context);
  }

  async getUsers(request: Request, response: Response) {
    const users = await this.userService.getUsers();
    this.send(response, 200, users);
  }

  async getUserById(request: Request<WithId>, response: Response, next: NextFunction) {
    const { id } = request.params;
    const user = await this.userService.getUserById(id);
    if (user) {
      this.send(response, 200, user);
      return;
    }
    next(new HTTPError(404, 'Пользователь по данному id не найдено', this.context));
  }

  async createUser(request: Request<unknown, unknown, CreateUserDto>, response: Response, next: NextFunction) {
    const { body } = request;
    const user = await this.userService.createUser(body);
    if (user) {
      this.created(response, user);
      return;
    }
    next(new HTTPError(400, "Не удалось создать пользователя", this.context));
  }

  async deleteUser(request: Request<WithId>, response: Response, next: NextFunction) {
    const { id } = request.params;
    const deletedId = await this.userService.deleteUser(id);
    if (deletedId) {
      this.ok(response, { id: deletedId });
      return;
    }
    next(new HTTPError(404, `Пользователь по id ${id} не найден`, this.context));
  }

  async updateUser(request: Request<WithId, unknown, UpdateUserDto>, response: Response, next: NextFunction) {
    const { body } = request;
    const { id } = request.params;
    const updatedUser = await this.userService.updateUser(id, body);
    if (updatedUser) {
      this.ok(response, updatedUser);
      return;
    }
    next(new HTTPError(404, `Пользователь c id ${id} не найден`, this.context));
  }
}


