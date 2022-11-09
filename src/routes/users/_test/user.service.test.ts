import "reflect-metadata";
import { Container } from "inversify";
import { IConfigService } from "../../../common/configService/config.service.interface";
import { IUserRepository } from "../interfaces/user.repository.interface";
import { IUserService } from "../interfaces/user.service.interface";
import { MaybeError, SERVICE_TYPES } from "../../../globalTypes";
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

const userMock: UserModel = {
  ...createUserMock,
  id: 1,
};

const usersMock = [userMock];

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

  const findFn = (id: number): MaybeError<UserModel> => usersMock.find(item => item.id === id) || errorMock;

  userRepository.createUser = jest.fn()
    .mockImplementation((user: CreateUserDto): MaybeError<UserModel> => {
      if (usersMock.some(item => item.email === user.email)) {
        return errorMock;
      }
      return { ...user, id: 1 };
    });


  userRepository.deleteUser = jest.fn().mockImplementation(findFn);
  userRepository.getUser = jest.fn().mockImplementation(findFn);
  userRepository.login = jest.fn()
    .mockImplementation((email: string) => usersMock.find(item => item.email === email) || errorMock);


  configService.get = jest.fn().mockReturnValue('2');
});

jest.mock('bcryptjs');

const bcrpytJsMocked = bcryptjs as jest.Mocked<typeof bcryptjs>;


describe('user service test', () => {
  describe('CREATE USER TEST', () => {
    it('should return new user', async () => {
      const createUserMock: CreateUserDto = {
        password: '1',
        age: 1,
        name: 'name',
        email: 'email1@email.com',
      };
      const createdUser = await userService.createUser(createUserMock) as UserModel;
      expect(createdUser.id).toEqual(1);
      expect(createdUser.password).not.toEqual(createUserMock.password);
    });

    it('should return error - user already exists', async () => {
      const finalData = await userService.createUser(createUserMock);
      expect(finalData).toEqual(errorMock);
    });
  });
  describe('GET USER', () => {
    it('should return user', async () => {
      const finalData = await userService.getUserById(1);
      expect(finalData).toEqual(userMock);
    });
    it('should return error - user does not exist', async () => {
      const id = 404;
      const finalData = await userService.getUserById(id);
      expect(finalData).toEqual(errorMock);
    });
  });
  describe('DELETE USER', () => {
    it('should return deleted user', async () => {
      const finalData = await userService.deleteUser(userMock.id);
      expect(finalData).toEqual(userMock);
    });
    it('should return error - user does not exist', async () => {
      const id = 404;
      const finalData = await userService.deleteUser(id);
      expect(finalData).toEqual(errorMock);
    });
  });
  describe('GET USERS', () => {
    it('should return users list', async () => {
      const model: UserModel = {
        ...createUserMock,
        id: 1,
      };
      userRepository.getUsers = jest.fn().mockReturnValue([model]);
      const finalData = await userService.getUsers();
      expect(finalData).toEqual([model]);
    });
  });

  describe('UPDATE USER USER', () => {
    it('should return updated data', async () => {
      const updateUser: UpdateUserDto = {
        password: 'change',
        age: 10,
        email: 'a@a.ru',
        name: 'changeName',
      };
      userRepository.updateUser = jest.fn().mockImplementationOnce((model: UserModel): UserModel => ({
        ...model,
      }));
      const expected = { ...createUserMock, ...updateUser, id: 1 };
      bcrpytJsMocked.hash.mockResolvedValueOnce(updateUser.password as never);

      const data = await userService.updateUser(1, updateUser) as UserModel;
      expect(expected).toEqual(data);
    });
    it('should return error - user does not exist', async () => {
      const updateUser: UpdateUserDto = {
        password: 'change',
        age: 10,
        email: 'a@a.ru',
        name: 'changeName',
      };
      const data = await userService.updateUser(22, updateUser) as UserModel;
      expect(bcrpytJsMocked.hash).not.toBeCalled();
      expect(data).toEqual(errorMock);
    });
  });
  describe('LOGIN USER', () => {
    it('should return user data', async () => {
      const user: UserModel = { ...userMock };
      bcrpytJsMocked.compare.mockResolvedValueOnce((user.password === createUserMock.password) as never);
      const data = await userService.login(createUserMock);
      expect(data).toEqual(userMock);
    });
    it('should return error - invalid password', async () => {
      const user: UserModel = { ...userMock, password: 'invalid password' };
      bcrpytJsMocked.compare.mockResolvedValueOnce((user.password === userMock.password) as never);
      const data = await userService.login(createUserMock) as HTTPError;
      expect(bcrpytJsMocked.compare).toBeCalled();
      expect(data.statusCode).toEqual(401);
    });
    it('should return error because - user does not exist', async () => {
      const data = await userService.login({ email: 'some@email.com', password: 'password' });
      expect(bcrpytJsMocked.compare).not.toBeCalled();
      expect(data).toEqual(errorMock);
    });
  });
});
