import { IMiddleware } from "./interface/middleware.interface";
import { ClassConstructor, plainToInstance } from "class-transformer";
import { NextFunction, Request, Response } from "express";
import { validate } from "class-validator";


export interface IValidateMiddlewareOptions {
  classToValidate: ClassConstructor<object>,
  forbiddenEmpty?: boolean,
}

export class ValidateMiddleware implements IMiddleware {
  classToValidate: ClassConstructor<object>;
  forbiddenEmpty?: boolean;

  constructor(
    { classToValidate, forbiddenEmpty }: IValidateMiddlewareOptions,
  ) {
    this.classToValidate = classToValidate;
    this.forbiddenEmpty = forbiddenEmpty;
  }

  execute = ({ body }: Request, res: Response, next: NextFunction) => {
    const instance = plainToInstance(this.classToValidate, body);
    if (0 === Object.keys(body).length && this.forbiddenEmpty) {
      res.status(404).send({ message: 'One of fields have to be fulled' });
      return;
    }
    validate(instance).then(errors => {
      if (errors.length > 0) {
        res.status(422).send(errors);
      } else {
        next();
      }
    });
  };
}
