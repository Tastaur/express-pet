import { UserModel } from "@prisma/client";
import { NullablePromise } from "../../../globalTypes";


export interface IUserRepository {
  getUsers: () => Promise<UserModel[]>;
  createUser: (user: UserModel) => NullablePromise<UserModel>;
  updateUser: (user: UserModel) => NullablePromise<UserModel>;
  getUser: (id: number) => NullablePromise<UserModel>;
  deleteUser: (id: number) => NullablePromise<UserModel>;
  login: (email: string) => NullablePromise<UserModel>;
}
