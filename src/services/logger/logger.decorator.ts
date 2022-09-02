import { LoggerService } from "./logger.service";

// eslint-disable-next-line @typescript-eslint/ban-types
export const LoggerDecorator = (target: Function) =>{
  target.prototype.logger = new LoggerService();
};