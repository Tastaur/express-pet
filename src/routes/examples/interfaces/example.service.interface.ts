import { Nullable } from "../../../globalTypes";
import { CreateExampleDto, UpdateExampleDto } from "../dto";
import { ExampleModel } from "@prisma/client";


export interface IExampleService {
  getExamples: () => Promise<ExampleModel[]>;
  getExampleById: (id: number) => Promise<Nullable<ExampleModel>>;
  deleteExample: (id: number) => Promise<Nullable<ExampleModel>>;
  createExample: (dto: CreateExampleDto) => Promise<Nullable<ExampleModel>>;
  updateExample: (id: number, dto: UpdateExampleDto) => Promise<Nullable<ExampleModel>>;
}
