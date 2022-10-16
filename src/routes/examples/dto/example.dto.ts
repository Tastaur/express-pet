export interface ExampleEntity {
  id?: number,
  name: string
}

export interface ExampleEntityDto extends Required<ExampleEntity> {
  id: number,
}

export class ExampleDto {
  private readonly _id: number;
  private _name: string;

  constructor(
    { name, id }: ExampleEntity,
  ) {
    this._name = name;
    this._id = id || -new Date();
  }

  get name(): string {
    return this._name;
  }

  get id(): number {
    return this._id;
  }

  setName(name: string) {
    this._name = name;
  }

  get plainObject(): ExampleEntityDto {
    return {
      id: this.id,
      name: this.name,
    };
  }
}