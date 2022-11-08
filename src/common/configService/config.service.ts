import { IConfigService } from "./config.service.interface";
import { inject, injectable } from "inversify";
import 'reflect-metadata';
import { DotenvConfigOutput, DotenvParseOutput, config } from "dotenv";
import { SERVICE_TYPES } from "../../globalTypes";
import { ILogger } from "../logger/logger.interface";
import { ENV_KEY } from "../../globalConstants";


@injectable()
export class ConfigService implements IConfigService {
  private readonly config: DotenvParseOutput;

  constructor(
    @inject(SERVICE_TYPES.ILogger) private logger: ILogger,
  ) {
    const result: DotenvConfigOutput = config();
    if (result.error) {
      this.logger.error("Cannot read .env or .env does not exist");
    } else {
      this.logger.log(`[ConfigService]: file .env was read`);
      this.config = 'test' !== process.env.NODE_ENV ? result.parsed as DotenvParseOutput : Object.values(ENV_KEY).reduce((acc, item) => {
        return { ...acc, [item]: process.env[item] } as DotenvParseOutput;
      }, {} as DotenvParseOutput);
    }
  }

  get(key: ENV_KEY): string {
    return this.config[key] as string;
  }
}
