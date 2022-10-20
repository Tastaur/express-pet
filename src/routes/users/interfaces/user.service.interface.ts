import { CreateUserDto, UpdateUserDto } from "../dto";
import { Nullable } from "../../../globalTypes";
import { UserModel } from "@prisma/client";


export interface IUserService {
  createUser: (dto: CreateUserDto) => Promise<Nullable<UserModel>>;
  updateUser: (userId: number, dto: UpdateUserDto) => Promise<Nullable<UserModel>>;
  getUsers: () => Promise<UserModel[]>;
  getUserById: (userId: number) => Promise<Nullable<UserModel>>;
  deleteUser: (userId: number) => Promise<Nullable<UserModel>>;
}