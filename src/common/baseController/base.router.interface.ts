import { NextFunction, Request, Response, Router } from "express";
import { IMiddleware } from "../middelwares/interface/middleware.interface";


export interface BaseRouterInterface{
  path: string,
  func: (request:Request<any, any, any, any>, response: Response, next: NextFunction) => void,
  method: keyof Pick<Router, 'get' | 'post' | 'delete' | 'patch' | 'put'>
  middlewares?: IMiddleware[]
}