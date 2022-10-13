export interface IPetDtoData {
  id?: number;
  name: string;
  hasTail: boolean;
}

export class PetDto {
  private readonly _id: number;
  private _name: string;
  private _hasTail: boolean;

  constructor({ name, id, hasTail }: IPetDtoData) {
    this._id = id || -new Date();
    this._hasTail = hasTail;
    this._name = name;
  }

  get id() {
    return this._id;
  }

  get name() {
    return this._name;
  }

  get hasTail() {
    return this._hasTail;
  }

  setName(name: string) {
    this._name = name;
  }

  setHasTail(hasTail: boolean) {
    this._hasTail = hasTail;
  }

  public updatePet({ name, hasTail }: IPetDtoData) {
    this.setName(name);
    this.setHasTail(hasTail);
  }

  get plainObject() {
    return {
      id: this.id,
      name: this.name,
      hasTail: this.hasTail,
    };
  }
}