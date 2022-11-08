import "reflect-metadata";
import { Container } from "inversify";
import { IConfigService } from "../../../common/configService/config.service.interface";
import { IUserRepository } from "../interfaces/user.repository.interface";
import { IUserService } from "../interfaces/user.service.interface";
import { SERVICE_TYPES } from "../../../globalTypes";
import { UserService } from "../user.service";
import { CreateUserDto, UpdateUserDto } from "../dto";
import { UserModel } from "@prisma/client";
import { HTTPError } from "../../../common/exceptionFIlter/http-error.class";
import * as bcryptjs from 'bcryptjs';


const userRepositoryMock: IUserRepository = {
  updateUser: jest.fn(),
  getUser: jest.fn(),
  getUsers: jest.fn(),
  deleteUser: jest.fn(),
  login: jest.fn(),
  createUser: jest.fn(),
};

const configServiceMock: IConfigService = {
  get: jest.fn(),
};

const createUserMock: CreateUserDto = {
  password: '1',
  age: 1,
  name: 'name',
  email: 'email@email.com',
};
jest.mock('bcryptjs');

const bcrpytJsMocked = bcryptjs as jest.Mocked<typeof bcryptjs>;

const errorMock = new HTTPError(404, 'errorMock');

const container = new Container();
let configService: IConfigService;
let userRepository: IUserRepository;
let userService: IUserService;

beforeAll(async () => {
  container.bind<IUserService>(SERVICE_TYPES.UsersService).to(UserService);
  container.bind<IUserRepository>(SERVICE_TYPES.UserRepository).toConstantValue(userRepositoryMock);
  container.bind<IConfigService>(SERVICE_TYPES.IConfigService).toConstantValue(configServiceMock);

  configService = container.get(SERVICE_TYPES.IConfigService);
  userRepository = container.get(SERVICE_TYPES.UserRepository);
  userService = container.get(SERVICE_TYPES.UsersService);
});

describe('user service test', () => {
  describe('CREATE USER TEST', () => {
    it('correct', async () => {
      configService.get = jest.fn().mockReturnValue('2');
      userRepository.createUser = jest.fn()
        .mockImplementationOnce((user: CreateUserDto): UserModel => ({
          ...user,
          id: 1,
        }));
      const createdUser = await userService.createUser(createUserMock) as UserModel;
      expect(createdUser.id).toEqual(1);
      expect(createdUser.password).not.toEqual(createUserMock.password);
    });

    it('with error', async () => {
      const createUserMock: CreateUserDto = {
        password: '1',
        age: 1,
        name: 'name',
        email: 'email@email.com',
      };
      configService.get = jest.fn().mockReturnValue('2');
      userRepository.createUser = jest.fn().mockImplementationOnce((_user: UserModel): HTTPError => errorMock);
      const finalData = await userService.createUser(createUserMock);
      expect(finalData).toEqual(errorMock);
    });
  });
  describe('UPDATE USER USER', () => {
    it('correct', async () => {
      const updateUser: UpdateUserDto = {
        password: 'change',
        age: 10,
        email: 'a@a.ru',
        name: 'changeName',
      };
      userRepository.getUser = jest.fn().mockImplementationOnce((id: number): UserModel => ({ ...createUserMock, id }));
      configService.get = jest.fn().mockReturnValue('1');
      userRepository.updateUser = jest.fn().mockImplementationOnce((model: UserModel): UserModel => ({
        ...model,
      }));
      const expected = { ...createUserMock, ...updateUser, id: 1 };
      bcrpytJsMocked.hash.mockResolvedValueOnce(updateUser.password as never);

      const data = await userService.updateUser(1, updateUser) as UserModel;
      expect(expected).toEqual(data);
    });
    it('user does not exist', async () => {
      const updateUser: UpdateUserDto = {
        password: 'change',
        age: 10,
        email: 'a@a.ru',
        name: 'changeName',
      };
      userRepository.getUser = jest.fn().mockImplementationOnce((_id: number): HTTPError => errorMock);
      const data = await userService.updateUser(1, updateUser) as UserModel;
      expect(data).toEqual(errorMock);
    });
    it('some mistake in data', async () => {
      const updateUser: UpdateUserDto = {
        password: 'change',
        age: 10,
        email: 'a@a.ru',
        name: 'changeName',
      };
      const someError = new HTTPError(400, 'New message');
      userRepository.getUser = jest.fn().mockImplementationOnce((id: number): UserModel => ({ ...createUserMock, id }));
      userRepository.updateUser = jest.fn().mockImplementationOnce((_dto: UserModel): HTTPError => someError);

      const data = await userService.updateUser(1, updateUser) as UserModel;
      expect(data).toEqual(someError);
      expect(data).not.toEqual(errorMock);
    });
  });
  describe('GET USERS', () => {
    it('correct way', async () => {
      const model: UserModel = {
        ...createUserMock,
        id: 1,
      };
      userRepository.getUsers = jest.fn().mockReturnValue([model]);
      const finalData = await userService.getUsers();
      expect(finalData).toEqual([model]);
    });
  });
  describe('GET USER', () => {
    it('correct way', async () => {
      const model: UserModel = {
        ...createUserMock,
        id: 1,
      };
      userRepository.getUser = jest.fn().mockImplementationOnce((_id: number) => model);
      const finalData = await userService.getUserById(model.id);
      expect(finalData).toEqual(model);
    });
    it('error way', async () => {
      const id = 404;
      userRepository.getUser = jest.fn().mockImplementationOnce((_id: number) => errorMock);
      const finalData = await userService.getUserById(id);
      expect(finalData).toEqual(errorMock);
    });
  });
  describe('DELETE USER', () => {
    it('correct way', async () => {
      const model: UserModel = {
        ...createUserMock,
        id: 1,
      };
      userRepository.deleteUser = jest.fn().mockImplementationOnce((_id: number) => model);
      const finalData = await userService.deleteUser(model.id);
      expect(finalData).toEqual(model);
    });
    it('error way', async () => {
      const id = 404;
      userRepository.deleteUser = jest.fn().mockImplementationOnce((_id: number) => errorMock);
      const finalData = await userService.deleteUser(id);
      expect(finalData).toEqual(errorMock);
    });
  });
  describe('LOGIN USER', () => {
    it('correct way', async () => {
      const userMock = { ...createUserMock, id: 1 };
      userRepository.login = jest.fn().mockImplementationOnce((_email: string) => userMock);
      bcrpytJsMocked.compare.mockResolvedValueOnce(true as never);
      const data = await userService.login(createUserMock);
      expect(data).toEqual(userMock);
    });
    it('invalid password', async () => {
      const userMock = { ...createUserMock, id: 1 };
      userRepository.login = jest.fn().mockImplementationOnce((_email: string) => userMock);
      bcrpytJsMocked.compare.mockResolvedValueOnce(false as never);
      const data = await userService.login(createUserMock) as HTTPError;
      expect(bcrpytJsMocked.compare).toBeCalled();
      expect(data.statusCode).toEqual(401);
    });
    it('user does not exist', async () => {
      userRepository.login = jest.fn().mockImplementationOnce((_email: string) => errorMock);
      bcrpytJsMocked.compare.mockResolvedValueOnce(true as never);
      const data = await userService.login(createUserMock);
      expect(bcrpytJsMocked.compare).not.toBeCalled();
      expect(data).toEqual(errorMock);
    });
  });
});
