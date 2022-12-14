import { IPetsRepository } from "./interfaces/pets.repository.interface";
import { inject, injectable } from "inversify";
import "reflect-metadata";
import { SERVICE_TYPES } from "../../globalTypes";
import { PrismaService } from "../../database/prisma.service";
import { PrismaClient } from "@prisma/client";
import { CreatePetDto, UpdatePetDto } from "./dto";
import { checkStringIsBoolean } from "../../utils/checkStringIsBoolean";
import { HTTPError } from "../../common/exceptionFIlter/http-error.class";
import { getNotFoundInstanceMessage } from "../../utils/getNotFoundInstanceMessage";


@injectable()
export class PetsRepository implements IPetsRepository {
  client: PrismaClient;

  constructor(
    @inject(SERVICE_TYPES.PrismaService) prisma: PrismaService,
  ) {
    this.client = prisma.client;
  }

  async getPets(hasTail?: string) {
    return this.client.petModel.findMany({
      where: { ...hasTail && checkStringIsBoolean(hasTail) && { hasTail: 'true' === hasTail } },
    });
  }

  async getPetById(id: number) {
    return this.client.petModel.findUnique({ where: { id } })
      .then(data => data || new HTTPError(404, getNotFoundInstanceMessage('Pet', id)));
  }

  async deletePet(id: number) {
    return this.client.petModel.delete({ where: { id } })
      .then(data => data)
      .catch(() => new HTTPError(404, getNotFoundInstanceMessage('Pet', id)));
  }

  async updatePet(id: number, dto: UpdatePetDto) {
    return this.client.petModel.update({ where: { id }, data: { ...dto } })
      .then(data => data)
      .catch(() => new HTTPError(404, getNotFoundInstanceMessage('Pet', id)));
  }


  async createPet(dto: CreatePetDto) {
    return this.client.petModel.create({ data: { ...dto } });
  }

}
