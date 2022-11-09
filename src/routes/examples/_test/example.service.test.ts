import { Container } from "inversify";
import { MaybeError, SERVICE_TYPES } from "../../../globalTypes";
import { IExampleRepository } from "../interfaces/example.repository.interface";
import { IExampleService } from "../interfaces/example.service.interface";
import { ExampleService } from "../example.service";
import { ExampleModel } from "@prisma/client";
import 'reflect-metadata';
import { HTTPError } from "../../../common/exceptionFIlter/http-error.class";
import { CreateExampleDto, UpdateExampleDto } from "../dto";


const exampleRepositoryMock: IExampleRepository = {
  getExampleById: jest.fn(),
  getExamples: jest.fn(),
  updateExample: jest.fn(),
  createExample: jest.fn(),
  deleteExample: jest.fn(),
};


const container = new Container();
let exampleRepository: IExampleRepository;
let exampleService: IExampleService;

const mockExample: ExampleModel = {
  id: 1,
  name: 'name',
};

const mockError = new HTTPError(404, 'MOCK ERROR');

const mockExamples = [mockExample];

beforeAll(async () => {
  container.bind<IExampleService>(SERVICE_TYPES.ExampleService).to(ExampleService);
  container.bind<IExampleRepository>(SERVICE_TYPES.ExampleRepository).toConstantValue(exampleRepositoryMock);

  exampleRepository = container.get(SERVICE_TYPES.ExampleRepository);
  exampleService = container.get(SERVICE_TYPES.ExampleService);

  const findFn = (id: number): MaybeError<ExampleModel> => mockExamples
    .find(item => item.id === id) || mockError;

  exampleRepository.getExampleById = jest.fn()
    .mockImplementation(findFn);

  exampleRepository.deleteExample = jest.fn()
    .mockImplementation(findFn);

  exampleRepository.updateExample = jest.fn()
    .mockImplementation((id: number, dto: UpdateExampleDto): MaybeError<ExampleModel> => {
      const currentExample = findFn(id);
      if (currentExample instanceof HTTPError) {
        return mockError;
      }
      return {
        ...currentExample,
        name: dto.name || currentExample.name,
      };
    });

  exampleRepository.createExample = jest.fn()
    .mockImplementation((dto: CreateExampleDto): MaybeError<ExampleModel> => {
      if ('name' in dto && dto.name) {
        return mockExample;
      }
      return mockError;
    });
});


describe('EXAMPLE SERVICE TEST', () => {
  it('GET ALL EXAMPLES', async () => {
    exampleRepository.getExamples = jest.fn().mockImplementationOnce(() => mockExamples);
    const data = await exampleService.getExamples();
    expect(data).toEqual([mockExample]);
  });
  describe('GET EXAMPLE BY ID', () => {
    it('should return example', async () => {
      const data = await exampleService.getExampleById(mockExample.id);
      expect(data).toEqual(mockExample);
    });
    it('should return error', async () => {
      const data = await exampleService.getExampleById(22);
      expect(data).toEqual(mockError);
    });
  });

  describe('DELETE EXAMPLE BY ID', () => {
    it('should return example', async () => {
      const data = await exampleService.deleteExample(mockExample.id);
      expect(data).toEqual(mockExample);
    });
    it('should return error', async () => {
      const data = await exampleService.deleteExample(22);
      expect(data).toEqual(mockError);
    });
  });

  describe('UPDATE EXAMPLE', () => {
    const changes: UpdateExampleDto = { name: 'newName' };

    it('should return updated example', async () => {
      const data = await exampleService.updateExample(mockExample.id, changes);
      expect(data).toEqual({ ...mockExample, ...changes });
    });
    it('should return error', async () => {
      const data = await exampleService.updateExample(22, changes);
      expect(data).toEqual(mockError);
    });
  });

  describe('CREATE EXAMPLE', () => {
    const newData: CreateExampleDto = { name: 'newName' };

    it('should return created example', async () => {
      const data = await exampleService.createExample(newData);
      expect(data).toEqual(mockExample);
    });
    it('should return error', async () => {
      const data = await exampleService.createExample({ name: '' });
      expect(data).toEqual(mockError);
    });
  });
});
