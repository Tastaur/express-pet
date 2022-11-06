import { NextFunction, Request, Response } from 'express';
import { BaseController } from "../../common/baseController/base.controller";
import { ENV_KEY, ROUTE_NAME } from "../../globalConstants";
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
import { IConfigService } from "../../common/configService/config.service.interface";
import { sign } from "jsonwebtoken";
import { AuthGuardMiddleware } from "../../common/middelwares/authGuardMiddleware";


@injectable()
export class UsersController extends BaseController implements IUserController {
  context = ROUTE_NAME.USERS;

  constructor(
    @inject(SERVICE_TYPES.ILogger) private loggerService: ILogger,
    @inject(SERVICE_TYPES.UsersService) private userService: IUserService,
    @inject(SERVICE_TYPES.IConfigService) private configService: IConfigService,
  ) {
    super(loggerService);
    this.bindRouter([{
      method: 'get',
      path: '/',
      func: this.getUsers,
      middlewares: [new AuthGuardMiddleware(this.context)],
    },
    {
      method: 'get',
      path: '/:id',
      func: this.getUserById,
      middlewares: [new AuthGuardMiddleware(this.context), new CheckIdMiddleware(this.context)],
    },
    {
      method: 'post',
      path: '/',
      func: this.createUser,
      middlewares: [new AuthGuardMiddleware(this.context), new ValidateMiddleware({ classToValidate: CreateUserDto })],
    },
    {
      method: 'delete',
      path: '/:id',
      func: this.deleteUser,
      middlewares: [new AuthGuardMiddleware(this.context), new CheckIdMiddleware(this.context)],
    },
    {
      method: 'put',
      path: '/:id',
      func: this.updateUser,
      middlewares: [
        new AuthGuardMiddleware(this.context),
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
    this.ok(response, users);
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
    const token = await this.signJWT(body.email);
    this.ok(response, { ...userData, token });
  }

  private async signJWT(email: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      sign({
        email,
        iat: Date.now(),
      }, this.configService.get(ENV_KEY.SECRET), {
        algorithm: "HS256",
      }, (error, token) => {
        if (error || !token) {
          reject(error);
        } else {
          resolve(token);
        }
      });
    });
  }
}


