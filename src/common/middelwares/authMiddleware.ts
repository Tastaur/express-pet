import { IMiddleware } from "./interface/middleware.interface";
import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";
import { hourInMillisecond } from "../../globalConstants";


export class AuthMiddleware implements IMiddleware {
  constructor(private secret: string) {
  }

  execute(req: Request, res: Response, next: NextFunction) {
    const auth = req.headers.authorization;
    if (auth) {
      verify(auth.split(' ')[1] || '', this.secret, (error, data) => {
        if (error) {
          next();
        } else if (data && typeof data !== "string") {
          if ('iat' in data && data.iat && Math.floor(Date.now() - data.iat) > hourInMillisecond) {
            next();
            return;
          }
          req.user = data.email;
          next();
        }
      });
    } else {
      next();
    }
  }
}
