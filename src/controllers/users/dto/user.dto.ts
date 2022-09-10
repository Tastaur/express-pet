import { hash } from "bcryptjs";


export interface IUserData {
  name: string,
  age: number,
  email: string,
  id?: number,
}

export class UserDto {
  private readonly _id: number;
  private _name: string;
  private _age: number;
  private _email: string;
  private _password: string;

  constructor({ id, email, age, name }: IUserData) {
    this._id = id || -new Date();
    this._email = email;
    this._age = age;
    this._name = name;
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

  public async setPassword(pass: string) {
    this._password = await hash(pass, process.env.SALT || '');
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

  updateUser = ({ email, age, name }: IUserData) => {
    this.setName(name);
    this.setEmail(email);
    this.setAge(age);
  };

  get plainObject() {
    return {
      id: this.id,
      email: this.email,
      age: this.age,
      name: this.name,
    };
  }

}