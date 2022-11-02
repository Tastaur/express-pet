import { HTTPError } from "../common/exceptionFIlter/http-error.class";


export const getHTTPErrorWithContext = (error: HTTPError, context: string) =>{
  return new HTTPError(error.statusCode, error.message, context);
};
