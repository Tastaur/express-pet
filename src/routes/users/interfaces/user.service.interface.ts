import { CreateUserDto, UpdateUserDto, UserDto } from "../dto";
import { IUserData } from "../dto/user.dto";


export interface IUserService {
  createUser: (dto: CreateUserDto) => Promise<UserDto | null>;
  updateUser: (userId: string, dto: UpdateUserDto) => Promise<UserDto | null>
  getUsers: () => Promise<IUserData[]>
  getUserById: (userId: string) => Promise<UserDto | null>
  deleteUser: (userId: string) => Promise<string | null>
}