import { CreateUserDto, UpdateUserDto } from "../dto";
import { NullablePromise } from "../../../globalTypes";
import { UserModel } from "@prisma/client";
import { UserLoginDto } from "../dto/user.login.dto";
import { HTTPError } from "../../../common/exceptionFIlter/http-error.class";


export interface IUserService {
  createUser: (dto: CreateUserDto) => NullablePromise<UserModel>;
  updateUser: (userId: number, dto: UpdateUserDto) => NullablePromise<UserModel>;
  getUsers: () => Promise<UserModel[]>;
  getUserById: (userId: number) => NullablePromise<UserModel>;
  deleteUser: (userId: number) => NullablePromise<UserModel>;
  login: (dto: UserLoginDto) => Promise<UserModel | HTTPError>;
}
