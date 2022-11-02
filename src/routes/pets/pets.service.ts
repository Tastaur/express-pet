import { inject, injectable } from "inversify";
import "reflect-metadata";
import { IPetsService } from "./interfaces/pets.service.interface";
import { CreatePetDto, UpdatePetDto } from "./dto";
import { SERVICE_TYPES } from "../../globalTypes";
import { IPetsRepository } from "./interfaces/pets.repository.interface";


@injectable()
export class PetsService implements IPetsService {
  constructor(
    @inject(SERVICE_TYPES.PetsRepository) private petsRepository: IPetsRepository,
  ) {
  }

  async getPetById(id: number) {
    return this.petsRepository.getPetById(id);
  }

  async getPets(hasTail?: string) {
    return this.petsRepository.getPets(hasTail);
  }

  async deletePet(id: number) {
    return this.petsRepository.deletePet(id);
  }

  async createPet(dto: CreatePetDto) {
    return this.petsRepository.createPet(dto);
  }

  async updatePet(id: number, dto: UpdatePetDto) {
    return this.petsRepository.updatePet(id, dto);
  }
}
