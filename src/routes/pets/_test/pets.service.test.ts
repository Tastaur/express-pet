import { Container } from "inversify";
import { SERVICE_TYPES } from "../../../globalTypes";
import 'reflect-metadata';
import { IPetsRepository } from "../interfaces/pets.repository.interface";
import { IPetsService } from "../interfaces/pets.service.interface";
import { PetsService } from "../pets.service";
import { PetModel } from "@prisma/client";


const petsRepositoryMock: IPetsRepository = {
  getPetById: jest.fn(),
  getPets: jest.fn(),
  updatePet: jest.fn(),
  createPet: jest.fn(),
  deletePet: jest.fn(),
};


const container = new Container();
let petsRepository: IPetsRepository;
let petsService: IPetsService;

beforeAll(async () => {
  container.bind<IPetsService>(SERVICE_TYPES.PetsService).to(PetsService);
  container.bind<IPetsRepository>(SERVICE_TYPES.PetsRepository).toConstantValue(petsRepositoryMock);

  petsRepository = container.get(SERVICE_TYPES.PetsRepository);
  petsService = container.get(SERVICE_TYPES.PetsService);
});

const mockPetWithTail: PetModel = {
  id: 1,
  name: 'first',
  hasTail: true,
};
const mockPetWithoutTail: PetModel = {
  id: 2,
  name: 'second',
  hasTail: false,
};

describe('PETS SERVICE TEST', () => {
  it('GET ALL PETS', async () => {
    petsRepository.getPets = jest.fn().mockImplementationOnce(() => [mockPetWithoutTail, mockPetWithTail]);
    const data = await petsService.getPets();
    expect(data).toEqual([mockPetWithoutTail, mockPetWithTail]);
  });
});
