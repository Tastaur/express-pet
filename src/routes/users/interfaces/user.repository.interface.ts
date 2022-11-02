import { UserModel } from "@prisma/client";
import { MaybeErrorPromise } from "../../../globalTypes";


export interface IUserRepository {
  getUsers: () => Promise<UserModel[]>;
  createUser: (user: UserModel) => MaybeErrorPromise<UserModel>;
  updateUser: (user: UserModel) => MaybeErrorPromise<UserModel>;
  getUser: (id: number) => MaybeErrorPromise<UserModel>;
  deleteUser: (id: number) => MaybeErrorPromise<UserModel>;
  login: (email: string) => MaybeErrorPromise<UserModel>;
}
