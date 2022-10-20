import { ParamsDictionary } from "express-serve-static-core";


export enum SERVICE_TYPES {
  Application = 'application',
  ILogger = 'ILogger',
  IConfigService = 'IConfigService',
  IExceptionFilter = 'ExceptionFilter',
  PrismaService = 'PrismaService',

  ExampleController = 'ExampleController',
  ExampleService = 'ExampleService',

  UsersController = 'UsersController',
  UsersService = 'UsersService',
  UserRepository = 'UserRepository',

  PetsController = 'PetsController',
  PetsService = 'PetsService',
}


export interface WithId extends ParamsDictionary {
  id: string;
}

export type Nullable<T> = T | null
export type NullablePromise<T> = Promise<Nullable<T>>