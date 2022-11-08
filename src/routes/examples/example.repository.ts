import { IExampleRepository } from "./interfaces/example.repository.interface";
import { inject, injectable } from "inversify";
import { SERVICE_TYPES } from "../../globalTypes";
import { PrismaService } from "../../database/prisma.service";
import { PrismaClient } from "@prisma/client";
import { CreateExampleDto, UpdateExampleDto } from "./dto";
import "reflect-metadata";
import { HTTPError } from "../../common/exceptionFIlter/http-error.class";
import { getNotFoundInstanceMessage } from "../../utils/getNotFoundInstanceMessage";


@injectable()
export class ExampleRepository implements IExampleRepository {
  client: PrismaClient;

  constructor(
    @inject(SERVICE_TYPES.PrismaService) prisma: PrismaService,
  ) {
    this.client = prisma.client;
  }

  async getExamples() {
    return this.client.exampleModel.findMany();
  }

  async getExampleById(id: number) {
    return this.client.exampleModel.findUnique({ where: { id } })
      .then(data => data || new HTTPError(404, getNotFoundInstanceMessage('Example', id)));
  }

  async deleteExample(id: number) {
    return this.client.exampleModel.delete({ where: { id } })
      .then(data => data)
      .catch(() => new HTTPError(404, getNotFoundInstanceMessage('Example', id)));
  }

  async createExample(dto: CreateExampleDto) {
    return this.client.exampleModel.create({ data: { ...dto } });
  }

  async updateExample(id: number, dto: UpdateExampleDto) {
    return this.client.exampleModel.update({ where: { id }, data: { ...dto } })
      .then(data => data)
      .catch(() => new HTTPError(404, getNotFoundInstanceMessage('Example', id)));
  }
}
