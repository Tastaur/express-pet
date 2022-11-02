import { PetModel } from "@prisma/client";
import { MaybeErrorPromise } from "../../../globalTypes";
import { CreatePetDto, UpdatePetDto } from "../dto";


export interface IPetsRepository {
  getPets: (hasTail?: string) => Promise<PetModel[]>;
  getPetById: (id: number) => MaybeErrorPromise<PetModel>;
  updatePet: (id: number, dto: UpdatePetDto) => MaybeErrorPromise<PetModel>;
  deletePet: (id: number) => MaybeErrorPromise<PetModel>;
  createPet: (dto: CreatePetDto) => Promise<PetModel>;
}
