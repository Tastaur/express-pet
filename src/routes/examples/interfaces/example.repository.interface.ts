import { ExampleModel } from "@prisma/client";
import { MaybeErrorPromise } from "../../../globalTypes";
import { CreateExampleDto, UpdateExampleDto } from "../dto";


export interface IExampleRepository {
  getExamples: () => Promise<ExampleModel[]>;
  getExampleById: (id: number) => MaybeErrorPromise<ExampleModel>;
  deleteExample: (id: number) => MaybeErrorPromise<ExampleModel>;
  updateExample: (id: number, dto: UpdateExampleDto) => MaybeErrorPromise<ExampleModel>;
  createExample: (dto: CreateExampleDto) => MaybeErrorPromise<ExampleModel>;
}
