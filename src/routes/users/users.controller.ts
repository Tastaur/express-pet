import { NextFunction, Request, Response } from 'express';
import { BaseController } from "../../common/baseController/base.controller";
import { ROUTE_NAME } from "../../globalConstants";
import { HTTPError } from "../../common/exceptionFIlter/http-error.class";
import { SERVICE_TYPES, WithId } from "../../globalTypes";
import { inject, injectable } from "inversify";
import { ILogger } from "../../common/logger/logger.interface";
import 'reflect-metadata';
import { CreateUserDto, UpdateUserDto, UserLoginDto } from "./dto";
import { IUserController } from "./interfaces/user.controller.interface";
import { IUserService } from "./interfaces/user.service.interface";
import { ValidateMiddleware } from "../../common/middelwares/validateMiddleware";
import { CheckIdMiddleware } from "../../common/middelwares/checkIdMiddleware";


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
      middlewares: [new CheckIdMiddleware(this.context)],
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
      middlewares: [new CheckIdMiddleware(this.context)],
    },
    {
      method: 'put',
      path: '/:id',
      func: this.updateUser,
      middlewares: [
        new CheckIdMiddleware(this.context),
        new ValidateMiddleware({ classToValidate: UpdateUserDto, forbiddenEmpty: true })],
    },
    {
      method: 'post',
      path: '/login',
      func: this.login,
      middlewares: [
        new ValidateMiddleware({ classToValidate: UserLoginDto }),
      ],
    },
    ], this.context);
  }

  async getUsers(request: Request, response: Response) {
    const users = await this.userService.getUsers();
    this.send(response, 200, users);
  }

  async getUserById(request: Request<WithId>, response: Response, next: NextFunction) {
    const { id } = request.params;
    const user = await this.userService.getUserById(Number(id));
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
    next(new HTTPError(400, "Пользователь уже существует", this.context));
  }

  async deleteUser(request: Request<WithId>, response: Response, next: NextFunction) {
    const { id } = request.params;
    const deletedUser = await this.userService.deleteUser(Number(id));
    if (deletedUser) {
      this.ok(response, { id: deletedUser.id });
      return;
    }
    next(new HTTPError(404, `Пользователь по id ${id} не найден`, this.context));
  }

  async updateUser(request: Request<WithId, unknown, UpdateUserDto>, response: Response, next: NextFunction) {
    const { body } = request;
    const { id } = request.params;
    const updatedUser = await this.userService.updateUser(Number(id), body);
    if (updatedUser) {
      this.ok(response, updatedUser);
      return;
    }
    next(new HTTPError(404, `Пользователь c id ${id} не найден`, this.context));
  }

  async login(request: Request<unknown, unknown, UserLoginDto>, response: Response, next: NextFunction) {
    const { body } = request;
    const data = await this.userService.login(body);
    if (data instanceof HTTPError) {
      next(new HTTPError(data.statusCode, data.message, this.context));
      return;
    }
    const { password, ...userData } = data;
    this.ok(response, userData);
  }
}


