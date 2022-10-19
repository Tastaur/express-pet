import { ParamsDictionary } from "express-serve-static-core";


export enum SERVICE_TYPES {
  Application = 'application',
  ILogger = 'ILogger',
  IConfigService = 'IConfigService',
  IExceptionFilter = 'ExceptionFilter',
  ExampleController = 'ExampleController',
  UsersController = 'UsersController',
  UsersService = 'UsersService',
  PetsController = 'PetsController',
  PetsService = 'PetsService',
  ExampleService = 'ExampleService'
}


export interface WithId extends ParamsDictionary {
  id: string;
}

export type Nullable<T> = T | null