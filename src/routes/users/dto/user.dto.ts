import { hash } from "bcryptjs";
import { UpdateUserDto } from "./update-user.dto";


export interface IUserData {
  name: string,
  age: number,
  email: string,
  password: string,
  id?: number,
}

export class UserDto {
  private readonly _id: number;
  private _name: string;
  private _age: number;
  private _email: string;
  private _password: string;

  constructor({ id, email, age, name, password }: IUserData) {
    this._id = id || -new Date();
    this._email = email;
    this._age = age;
    this._name = name;
    this._password = password;
  }

  get name() {
    return this._name;
  }

  get age() {
    return this._age;
  }

  get email() {
    return this._email;
  }

  get id() {
    return this._id;
  }

  get password() {
    return this._password;
  }

  public async setPassword(pass: string, salt: string) {
    this._password = await hash(pass, Number.parseInt(salt, 10));
  }

  setName(name: string) {
    this._name = name;
  }

  setAge(age: number) {
    this._age = age;
  }

  setEmail(email: string) {
    this._email = email;
  }

  updateUser = ({ email, age, name, password }: UpdateUserDto, salt?: string) => {
    name && this.setName(name);
    email && this.setEmail(email);
    age && this.setAge(age);
    password && salt && this.setPassword(password, salt);
  };

  get plainObject(): IUserData {
    return {
      id: this.id,
      email: this.email,
      age: this.age,
      name: this.name,
      password: this._password,
    };
  }

}