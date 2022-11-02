import { CreateUserDto, UpdateUserDto } from "../dto";
import { MaybeErrorPromise } from "../../../globalTypes";
import { UserModel } from "@prisma/client";
import { UserLoginDto } from "../dto/user.login.dto";


export interface IUserService {
  createUser: (dto: CreateUserDto) => MaybeErrorPromise<UserModel>;
  updateUser: (userId: number, dto: UpdateUserDto) => MaybeErrorPromise<UserModel>;
  getUsers: () => Promise<UserModel[]>;
  getUserById: (userId: number) => MaybeErrorPromise<UserModel>;
  deleteUser: (userId: number) => MaybeErrorPromise<UserModel>;
  login: (dto: UserLoginDto) => MaybeErrorPromise<UserModel>;
}
