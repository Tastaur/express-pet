import { CreatePetDto, UpdatePetDto } from "../dto";
import { NullablePromise } from "../../../globalTypes";
import { PetModel } from "@prisma/client";


export interface IPetsService {
  getPets: (hasTail?: string) => Promise<PetModel[]>;
  getPetById: (id: number) => NullablePromise<PetModel>;
  createPet: (data: CreatePetDto) => NullablePromise<PetModel>;
  updatePet: (id: number, data: UpdatePetDto) => NullablePromise<PetModel>;
  deletePet: (id: number) => NullablePromise<PetModel>;
}