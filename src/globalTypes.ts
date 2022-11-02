import { ParamsDictionary } from "express-serve-static-core";
import { HTTPError } from "./common/exceptionFIlter/http-error.class";


export enum SERVICE_TYPES {
  Application = 'application',
  ILogger = 'ILogger',
  IConfigService = 'IConfigService',
  IExceptionFilter = 'ExceptionFilter',
  PrismaService = 'PrismaService',

  ExampleController = 'ExampleController',
  ExampleService = 'ExampleService',
  ExampleRepository = 'ExampleRepository',

  UsersController = 'UsersController',
  UsersService = 'UsersService',
  UserRepository = 'UserRepository',

  PetsController = 'PetsController',
  PetsService = 'PetsService',
  PetsRepository = 'PetsRepository'
}


export interface WithId extends ParamsDictionary {
  id: string;
}

export type Nullable<T> = T | null
export type NullablePromise<T> = Promise<Nullable<T>>
export type MaybeError<T> = T | HTTPError
export type MaybeErrorPromise<T> = Promise<MaybeError<T>>
