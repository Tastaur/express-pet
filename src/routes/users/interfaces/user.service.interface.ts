import { CreateUserDto, UpdateUserDto } from "../dto";
import { IUserData } from "../dto/user.dto";
import { Nullable } from "../../../globalTypes";


export interface IUserService {
  createUser: (dto: CreateUserDto) => Promise<Nullable<IUserData>>;
  updateUser: (userId: string, dto: UpdateUserDto) => Promise<Nullable<IUserData>>;
  getUsers: () => Promise<IUserData[]>;
  getUserById: (userId: string) => Promise<Nullable<IUserData>>;
  deleteUser: (userId: string) => Promise<Nullable<string>>;
}