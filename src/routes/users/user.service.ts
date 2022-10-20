import { IUserService } from "./interfaces/user.service.interface";
import { CreateUserDto, UpdateUserDto, UserDto } from "./dto";
import { inject, injectable } from "inversify";
import 'reflect-metadata';
import { SERVICE_TYPES } from "../../globalTypes";
import { IConfigService } from "../../common/configService/config.service.interface";
import { ENV_KEY } from "../../globalConstants";
import { IUserRepository } from "./interfaces/user.repository.interface";


@injectable()
export class UserService implements IUserService {
  constructor(
    @inject(SERVICE_TYPES.IConfigService) private configService: IConfigService,
    @inject(SERVICE_TYPES.UserRepository) private userRepository: IUserRepository,
  ) {
  }

  // add logic if equal instant exists
  async createUser(dto: CreateUserDto) {
    const user = new UserDto(dto);
    await user.updateUser(dto, this.configService.get(ENV_KEY.SALT));
    return this.userRepository.createUser(user.plainObject);
  }

  async updateUser(userId: number, dto: UpdateUserDto) {
    const currentUser = await this.userRepository.getUser(userId);
    if (currentUser) {
      const user = new UserDto(currentUser);
      user.updateUser(dto, this.configService.get(ENV_KEY.SALT));
      return this.userRepository.updateUser(user.plainObject);
    }
    return null;
  }

  async getUserById(id: number) {
    return this.userRepository.getUser(id);
  }

  async deleteUser(id: number) {
    return this.userRepository.deleteUser(id);
  }

  async getUsers() {
    return this.userRepository.getUsers();
  }

}