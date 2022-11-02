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
import { getHTTPErrorWithContext } from "../../utils/getHTTPErrorWithContext";


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
    const data = await this.userService.getUserById(Number(id));
    if (data instanceof HTTPError) {
      next(getHTTPErrorWithContext(data, this.context));
      return;
    }
    this.send(response, 200, data);
  }

  async createUser(request: Request<unknown, unknown, CreateUserDto>, response: Response, next: NextFunction) {
    const { body } = request;
    const data = await this.userService.createUser(body);
    if (data instanceof HTTPError) {
      next(getHTTPErrorWithContext(data,this.context));
      return;
    }
    this.created(response, data);
  }

  async deleteUser(request: Request<WithId>, response: Response, next: NextFunction) {
    const { id } = request.params;
    const data = await this.userService.deleteUser(Number(id));
    if (data instanceof HTTPError) {
      next(getHTTPErrorWithContext(data,this.context));
      return;
    }
    this.ok(response, { id: data.id });
  }

  async updateUser(request: Request<WithId, unknown, UpdateUserDto>, response: Response, next: NextFunction) {
    const { body } = request;
    const { id } = request.params;
    const data = await this.userService.updateUser(Number(id), body);
    if (data instanceof HTTPError) {
      next(getHTTPErrorWithContext(data,this.context));
      return;
    }
    this.ok(response, data);
  }

  async login(request: Request<unknown, unknown, UserLoginDto>, response: Response, next: NextFunction) {
    const { body } = request;
    const data = await this.userService.login(body);
    if (data instanceof HTTPError) {
      next(getHTTPErrorWithContext(data, this.context));
      return;
    }
    const { password, ...userData } = data;
    this.ok(response, userData);
  }
}


