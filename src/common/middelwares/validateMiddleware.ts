import { IMiddleware } from "./interface/middleware.interface";
import { ClassConstructor, plainToInstance } from "class-transformer";
import { NextFunction, Request, Response } from "express";
import { validate } from "class-validator";


export class ValidateMiddleware implements IMiddleware {
  constructor(private classToValidate: ClassConstructor<object>) {
  }

  execute({ body }: Request, res: Response, next: NextFunction) {
    const instance = plainToInstance(this.classToValidate, body);
    validate(instance).then(errors => {
      if(errors.length > 0) {
        res.status(422).send(errors);
      } else {
        next();
      }
    });
  }
}