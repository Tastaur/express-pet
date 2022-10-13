import { ParamsDictionary } from "express-serve-static-core";


export enum SERVICE_TYPES {
  Application = 'application',
  ILogger = 'ILogger',
  IExceptionFilter = 'ExceptionFilter',
  ExampleController = 'ExampleController',
  UsersController = 'UsersController',
  UsersService = 'UsersService',
  PetsController = 'PetsController'
}


export interface WithId extends ParamsDictionary{
  id: string
}