import { Container } from "inversify";
import { SERVICE_TYPES } from "../../../globalTypes";
import { IExampleRepository } from "../interfaces/example.repository.interface";
import { IExampleService } from "../interfaces/example.service.interface";
import { ExampleService } from "../example.service";
import { ExampleModel } from "@prisma/client";
import 'reflect-metadata';


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

beforeAll(async () => {
  container.bind<IExampleService>(SERVICE_TYPES.ExampleService).to(ExampleService);
  container.bind<IExampleRepository>(SERVICE_TYPES.ExampleRepository).toConstantValue(exampleRepositoryMock);

  exampleRepository = container.get(SERVICE_TYPES.ExampleRepository);
  exampleService = container.get(SERVICE_TYPES.ExampleService);
});

const mockExample: ExampleModel = {
  id: 1,
  name: 'name',
};

describe('EXAMPLE SERVICE TEST', () => {
  it('GET ALL EXAMPLES', async () => {
    exampleRepository.getExamples = jest.fn().mockImplementationOnce(() => [mockExample]);
    const data = await exampleService.getExamples();
    expect(data).toEqual([mockExample]);
  });
});
