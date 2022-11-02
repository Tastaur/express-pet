import { CreatePetDto, UpdatePetDto } from "../dto";
import { MaybeErrorPromise } from "../../../globalTypes";
import { PetModel } from "@prisma/client";


export interface IPetsService {
  getPets: (hasTail?: string) => Promise<PetModel[]>;
  getPetById: (id: number) => MaybeErrorPromise<PetModel>;
  createPet: (data: CreatePetDto) => MaybeErrorPromise<PetModel>;
  updatePet: (id: number, data: UpdatePetDto) => MaybeErrorPromise<PetModel>;
  deletePet: (id: number) => MaybeErrorPromise<PetModel>;
}
