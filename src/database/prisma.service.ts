import 'reflect-metadata';
import { inject, injectable } from "inversify";
import { PrismaClient } from "@prisma/client";
import { SERVICE_TYPES } from "../globalTypes";
import { ILogger } from "../common/logger/logger.interface";


@injectable()
export class PrismaService {
  client: PrismaClient;

  constructor(
    @inject(SERVICE_TYPES.ILogger) private logger: ILogger,
  ) {
    this.client = new PrismaClient();
  }

  async connection() {
    await this.client.$connect()
      .then(() => {
        this.logger.log('[Prisma]: база данных подключена');
      }).catch(error => {
        if (error instanceof Error) {
          this.logger.error(`[Prisma]: ошибка подключения к базе данных ${error.message}`);
        }
      });
  }

  async disconnection() {
    await this.client.$disconnect();
  }
}