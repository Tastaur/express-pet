import { ExampleModel } from "@prisma/client";
import { NullablePromise } from "../../../globalTypes";
import { CreateExampleDto, UpdateExampleDto } from "../dto";


export interface IExampleRepository {
  getExamples: () => Promise<ExampleModel[]>;
  getExampleById: (id: number) => NullablePromise<ExampleModel>;
  deleteExample: (id: number) => NullablePromise<ExampleModel>;
  updateExample: (id: number, dto: UpdateExampleDto) => NullablePromise<ExampleModel>;
  createExample: (dto: CreateExampleDto) => NullablePromise<ExampleModel>;
}
