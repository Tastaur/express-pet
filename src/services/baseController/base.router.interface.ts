import { NextFunction, Request, Response, Router } from "express";


export interface BaseRouterInterface{
  path: string,
  func: (request:Request<any, any, any, any>, response: Response, next: NextFunction) => void,
  method: keyof Pick<Router, 'get' | 'post' | 'delete' | 'patch' | 'put'>
}