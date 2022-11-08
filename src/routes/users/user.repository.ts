import "reflect-metadata";
import { inject, injectable } from "inversify";
import { IUserRepository } from "./interfaces/user.repository.interface";
import { SERVICE_TYPES } from "../../globalTypes";
import { PrismaClient, UserModel } from "@prisma/client";
import { PrismaService } from "../../database/prisma.service";
import { HTTPError } from "../../common/exceptionFIlter/http-error.class";
import { getNotFoundInstanceMessage } from "../../utils/getNotFoundInstanceMessage";


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
    return this.client.userModel.findUnique({ where: { id } }).then(data => {
      return data || new HTTPError(404, getNotFoundInstanceMessage('User', id));
    })
      .catch(() => new HTTPError(500, `Something went wrong`));
  }

  async createUser({ name, password, age, email }: UserModel) {
    return new Promise<UserModel>(resolve => {
      resolve(this.client.userModel.create({
        data: {
          name,
          password,
          age,
          email,
        },
      }));
    }).then(data => data)
      .catch(() => new HTTPError(403, 'User with this email already exist'));
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
      .then((data) => data)
      .catch(() => new HTTPError(400, 'Incorrect data'));
  }

  async deleteUser(id: number) {
    return new Promise<UserModel>((res) => {
      res(this.client.userModel.delete({
        where: { id },
      }));
    })
      .then((data: UserModel) => data)
      .catch(() => new HTTPError(404, getNotFoundInstanceMessage('User', id)));
  }

  async login(email: string) {
    return new Promise<UserModel | null>((resolve) => {
      resolve(this.client.userModel.findFirst({ where: { email } }));
    })
      .then(data => data || new HTTPError(404, `User with email ${email} was not found`))
      .catch(() => new HTTPError(500, 'Something went wrong'));
  }
}
