import { ParamsDictionary } from "express-serve-static-core";

export enum SERVICE_TYPES  {
  Application = 'application',
  ILogger = 'ILogger',
  IExceptionFilter = 'ExceptionFilter',
  Example = 'Example',
  Users = 'Users',
}


export interface WithId extends ParamsDictionary{
  id: string
}