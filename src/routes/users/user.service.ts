import { IUserService } from "./interfaces/user.service.interface";
import { CreateUserDto, UpdateUserDto, UserDto } from "./dto";
import { inject, injectable } from "inversify";
import 'reflect-metadata';
import { usersObject } from "./users.controller";
import { getArrayFromRecord } from "../../utils/getArrayFromRecord";
import { SERVICE_TYPES } from "../../globalTypes";
import { IConfigService } from "../../common/configService/config.service.interface";
import { ENV_KEY } from "../../globalConstants";


@injectable()
export class UserService implements IUserService {
  constructor(
    @inject(SERVICE_TYPES.IConfigService) private configService: IConfigService,
  ) {
  }

  // add logic if equal instant exists
  async createUser(dto: CreateUserDto) {
    const user = new UserDto(dto);
    await user.setPassword(dto.password, this.configService.get(ENV_KEY.SALT));
    usersObject[user.id] = user;
    return user.plainObject;
  }

  async updateUser(userId: string, dto: UpdateUserDto) {
    const currentUser = usersObject[userId];
    if (currentUser) {
      const user = new UserDto(currentUser);
      user.updateUser(dto, this.configService.get(ENV_KEY.SALT));
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