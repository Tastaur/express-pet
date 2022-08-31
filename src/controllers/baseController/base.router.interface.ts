import { NextFunction, Request, Response, Router } from "express";

export interface BaseRouterInterface<RQ extends Request, RS extends Response> {
  path: string,
  func: (request: RQ, response: RS, next: NextFunction) => void,
  method: keyof Pick<Router, 'get' | 'post' | 'delete' | 'patch' | 'put'>
}