import "reflect-metadata";
import { inject, injectable } from "inversify";
import { IUserRepository } from "./interfaces/user.repository.interface";
import { SERVICE_TYPES } from "../../globalTypes";
import { PrismaClient, UserModel } from "@prisma/client";
import { PrismaService } from "../../database/prisma.service";


@injectable()
export class UserRepository implements IUserRepository {
  client: PrismaClient;

  constructor(
    @inject(SERVICE_TYPES.PrismaService) prismaClient: PrismaService,
  ) {
    this.client = prismaClient.client;
  }

  async getUsers() {
    return this.client.userModel.findMany();
  }

  async getUser(id: number) {
    return this.client.userModel.findUnique({ where: { id } });
  }

  async createUser({ name, password, age, email }: UserModel) {
    return this.client.userModel.create({
      data: {
        name,
        password,
        age,
        email,
      },
    });
  }

  async updateUser({ id, ...rest }: UserModel) {
    return new Promise<UserModel>((res) => {
      res(this.client.userModel.update({
        where: { id },
        data: {
          ...rest,
        },
      }));
    })
      .then((data: UserModel) => data)
      .catch(() => null);
  }

  async deleteUser(id: number) {
    return new Promise<UserModel>((res) => {
      res(this.client.userModel.delete({
        where: { id },
      }));
    })
      .then((data: UserModel) => data)
      .catch(() => null);
  }
}