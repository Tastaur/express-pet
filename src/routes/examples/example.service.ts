import 'reflect-metadata';
import { inject, injectable } from "inversify";
import { IExampleService } from "./interfaces/example.service.interface";
import { CreateExampleDto, UpdateExampleDto } from "./dto";
import { SERVICE_TYPES } from "../../globalTypes";
import { IExampleRepository } from "./interfaces/example.repository.interface";


@injectable()
export class ExampleService implements IExampleService {
  constructor(
    @inject(SERVICE_TYPES.ExampleRepository) private exampleRepository: IExampleRepository,
  ) {
  }

  async getExamples() {
    return this.exampleRepository.getExamples();
  }

  async getExampleById(id: number) {
    return this.exampleRepository.getExampleById(id);
  }

  async createExample(dto: CreateExampleDto) {
    return this.exampleRepository.createExample(dto);
  }

  async deleteExample(id: number) {
    return this.exampleRepository.deleteExample(id);
  }

  async updateExample(id: number, dto: UpdateExampleDto) {
    return this.exampleRepository.updateExample(id, dto);
  }
}
