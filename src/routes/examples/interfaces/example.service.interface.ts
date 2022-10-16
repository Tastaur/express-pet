import { ExampleEntityDto } from "../dto/example.dto";
import { Nullable } from "../../../globalTypes";
import { CreateExampleDto, UpdateExampleDto } from "../dto";


export interface IExampleService {
  getExamples: () => Promise<ExampleEntityDto[]>;
  getExampleById: (id: string) => Promise<Nullable<ExampleEntityDto>>;
  deleteExample: (id: string) => Promise<Nullable<string>>;
  createExample: (dto: CreateExampleDto) => Promise<Nullable<ExampleEntityDto>>;
  updateExample: (id: string, dto: UpdateExampleDto) => Promise<Nullable<ExampleEntityDto>>;
}