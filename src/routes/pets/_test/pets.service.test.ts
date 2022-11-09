import { Container } from "inversify";
import { SERVICE_TYPES } from "../../../globalTypes";
import 'reflect-metadata';
import { IPetsRepository } from "../interfaces/pets.repository.interface";
import { IPetsService } from "../interfaces/pets.service.interface";
import { PetsService } from "../pets.service";
import { PetModel } from "@prisma/client";
import { HTTPError } from "../../../common/exceptionFIlter/http-error.class";
import { CreatePetDto, UpdatePetDto } from "../dto";


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

const mockPets = [mockPetWithoutTail, mockPetWithTail];

const mockError = new HTTPError(400, 'MOCK ERROR');

beforeAll(async () => {
  container.bind<IPetsService>(SERVICE_TYPES.PetsService).to(PetsService);
  container.bind<IPetsRepository>(SERVICE_TYPES.PetsRepository).toConstantValue(petsRepositoryMock);

  petsRepository = container.get(SERVICE_TYPES.PetsRepository);
  petsService = container.get(SERVICE_TYPES.PetsService);

  const findFn = (id: number) => mockPets.find(item => item.id === id) || mockError;

  petsRepository.getPetById = jest.fn().mockImplementation(findFn);
  petsRepository.deletePet = jest.fn().mockImplementation(findFn);
  petsRepository.getPets = jest.fn().mockImplementation((hasTail?: string) => {
    if (hasTail && ['true', 'false'].includes(hasTail)) {
      return mockPets.filter(item => String(item.hasTail) === hasTail);
    }
    return mockPets;
  });
  petsRepository.updatePet = jest.fn().mockImplementation((id: number, dto: UpdatePetDto) => {
    const currentPet = findFn(id);
    if (currentPet instanceof HTTPError) {
      return mockError;
    }
    return { ...currentPet, ...dto };
  });
  petsRepository.createPet = jest.fn().mockImplementation((dto: CreatePetDto) => {
    return { ...dto, id: 8 };
  });

});


describe('PETS SERVICE TEST', () => {
  describe('GET ALL PETS', () => {
    it('get all without query', async () => {
      const data = await petsService.getPets();
      expect(data).toEqual(mockPets);
    });
    it('get all with incorrect query', async () => {
      const data = await petsService.getPets('incorrect');
      expect(data).toEqual(mockPets);
    });
    it('get all with  query true', async () => {
      const data = await petsService.getPets('true');
      expect(data).toEqual([mockPetWithTail]);
    });
    it('get all with  query false', async () => {
      const data = await petsService.getPets('false');
      expect(data).toEqual([mockPetWithoutTail]);
    });
  });
  describe('GET PET BY ID', () => {
    it('should return pet', async () => {
      const data = await petsService.getPetById(mockPetWithTail.id);
      expect(data).toEqual(mockPetWithTail);
      expect(data).not.toEqual(mockPetWithoutTail);
    });
    it('should return error', async () => {
      const data = await petsService.getPetById(323);
      expect(data).toEqual(mockError);
    });
  });
  describe('DELETE PET BY ID', () => {
    it('should return pet', async () => {
      const data = await petsService.deletePet(mockPetWithTail.id);
      expect(data).toEqual(mockPetWithTail);
    });
    it('should return error', async () => {
      const data = await petsService.deletePet(323);
      expect(data).toEqual(mockError);
    });
  });
  describe('UPDATE PET', () => {
    it('should return updated pet', async () => {
      const changes: UpdatePetDto = { name: 'newName' };
      const data = await petsService.updatePet(mockPetWithTail.id, changes);
      expect(data).toEqual({ ...mockPetWithTail, ...changes });
    });
    it('should return error', async () => {
      const changes: UpdatePetDto = { hasTail: false };
      const data = await petsService.updatePet(5500, changes);
      expect(data).toEqual(mockError);
    });
  });
  describe('CREATE PET', () => {
    it('should return new pet', async () => {
      const payload: CreatePetDto = { name: 'New pet', hasTail: true };
      const data = await petsService.createPet(payload);
      expect(data).toEqual({ ...payload, id: 8 });
    });
  });
});
