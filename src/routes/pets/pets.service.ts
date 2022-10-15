import { injectable } from "inversify";
import "reflect-metadata";
import { IPetsService } from "./interfaces/pets.service.interface";
import { CreatePetDto, PetDto, UpdatePetDto } from "./dto";
import { getArrayFromRecord } from "../../utils/getArrayFromRecord";
import { filterByStringBoolean } from "../../utils/filterByStringBoolean";
import { petMockObjects } from "./pets.controller";


@injectable()
export class PetsService implements IPetsService {
  async getPetById(id: string) {
    return petMockObjects[id] || null;
  }

  async getPets(hasTail?: string) {
    return getArrayFromRecord(petMockObjects)
      .filter(item => filterByStringBoolean(item.hasTail, hasTail));
  }

  async deletePet(id: string) {
    if (id in petMockObjects) {
      delete petMockObjects[id];
      return id;
    }
    return null;
  }

  // add logic if equal instant exists
  async createPet(dto: CreatePetDto) {
    const pet = new PetDto(dto);
    petMockObjects[pet.id] = pet;
    return pet.plainObject;
  }

  async updatePet(id: string, dto: UpdatePetDto) {
    const currentPet = petMockObjects[id];
    if (currentPet) {
      const updatedPet = new PetDto(currentPet);
      updatedPet.updatePet(dto);
      const plainPet = updatedPet.plainObject;
      petMockObjects[id] = plainPet;
      return plainPet;
    }
    return null;
  }
}