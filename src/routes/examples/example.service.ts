import 'reflect-metadata';
import { injectable } from "inversify";
import { IExampleService } from "./interfaces/example.service.interface";
import { getArrayFromRecord } from "../../utils/getArrayFromRecord";
import { exampleObject } from "./examples.controller";
import { CreateExampleDto, ExampleDto, UpdateExampleDto } from "./dto";


@injectable()
export class ExampleService implements IExampleService {
  async getExamples() {
    return getArrayFromRecord(exampleObject);
  }

  async getExampleById(id: string) {
    return exampleObject[id] || null;
  }

  // todo add scenario when instance already exist
  async createExample(dto: CreateExampleDto) {
    const result = new ExampleDto(dto);
    const plainResult = result.plainObject;
    exampleObject[result.id] = plainResult;
    return plainResult;
  }

  async deleteExample(id: string) {
    if (id in exampleObject) {
      delete exampleObject[id];
      return id;
    }
    return null;
  }

  async updateExample(id: string, dto: UpdateExampleDto) {
    if (id) {
      const currentExample = new ExampleDto({ id: Number(id), ...dto });
      currentExample.setName(dto.name);
      const plainExample = currentExample.plainObject;
      exampleObject[id] = plainExample;
      return plainExample;
    }
    return null;
  }
}