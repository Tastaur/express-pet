import { CreatePetDto, UpdatePetDto } from "../dto";
import { Nullable } from "../../../globalTypes";
import { IPetDtoData } from "../dto/pet.dto";


export interface IPetsService {
  getPets: (hasTail?: string) => Promise<IPetDtoData[]>;
  getPetById: (id: string) => Promise<Nullable<IPetDtoData>>;
  createPet: (data: CreatePetDto) => Promise<Nullable<IPetDtoData>>;
  updatePet: (id: string, data: UpdatePetDto) => Promise<Nullable<IPetDtoData>>;
  deletePet: (id: string) => Promise<Nullable<string>>;
}