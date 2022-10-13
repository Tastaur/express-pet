import { IUserService } from "./interfaces/user.service.interface";
import { CreateUserDto, UpdateUserDto, UserDto } from "./dto";
import { injectable } from "inversify";
import 'reflect-metadata';
import { usersObject } from "./users.controller";
import { getArrayFromRecord } from "../../utils/getArrayFromRecord";


@injectable()
export class UserService implements IUserService {
  async createUser(dto: CreateUserDto) {
    const user = new UserDto(dto);
    await user.setPassword(dto.password);
    return user;
  }

  async updateUser(userId: string, dto: UpdateUserDto) {
    const currentUser = usersObject[userId];
    if (currentUser) {
      currentUser.updateUser(dto);
      return currentUser;
    }
    return null;
  }

  async getUserById(id: string) {
    return usersObject[id] || null;
  }

  async deleteUser(id: string) {
    if (usersObject[id]) {
      delete usersObject[id];
      return id;
    }
    return null;
  }

  async getUsers() {
    return getArrayFromRecord(usersObject).map(item => item.plainObject);
  }

}