import { MaybeErrorPromise } from "../../../globalTypes";
import { CreateExampleDto, UpdateExampleDto } from "../dto";
import { ExampleModel } from "@prisma/client";


export interface IExampleService {
  getExamples: () => Promise<ExampleModel[]>;
  getExampleById: (id: number) => MaybeErrorPromise<ExampleModel>;
  deleteExample: (id: number) => MaybeErrorPromise<ExampleModel>;
  createExample: (dto: CreateExampleDto) => MaybeErrorPromise<ExampleModel>;
  updateExample: (id: number, dto: UpdateExampleDto) => MaybeErrorPromise<ExampleModel>;
}
