import { PetModel } from "@prisma/client";
import { NullablePromise } from "../../../globalTypes";
import { CreatePetDto, UpdatePetDto } from "../dto";


export interface IPetsRepository {
  getPets: (hasTail?: string) => Promise<PetModel[]>;
  getPetById: (id: number) => NullablePromise<PetModel>;
  updatePet: (id: number, dto: UpdatePetDto) => NullablePromise<PetModel>;
  deletePet: (id: number) => NullablePromise<PetModel>;
  createPet: (dto: CreatePetDto) => Promise<PetModel>;
}