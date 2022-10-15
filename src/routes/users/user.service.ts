import { IUserService } from "./interfaces/user.service.interface";
import { CreateUserDto, UpdateUserDto, UserDto } from "./dto";
import { injectable } from "inversify";
import 'reflect-metadata';
import { usersObject } from "./users.controller";
import { getArrayFromRecord } from "../../utils/getArrayFromRecord";


@injectable()
export class UserService implements IUserService {
  // add logic if equal instant exists
  async createUser(dto: CreateUserDto) {
    const user = new UserDto(dto);
    await user.setPassword(dto.password);
    usersObject[user.id] = user;
    return user.plainObject;
  }

  async updateUser(userId: string, dto: UpdateUserDto) {
    const currentUser = usersObject[userId];
    if (currentUser) {
      const user = new UserDto(currentUser);
      user.updateUser(dto);
      const plainUser = user.plainObject;
      usersObject[userId] = plainUser;
      return plainUser;
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
    return getArrayFromRecord(usersObject);
  }

}