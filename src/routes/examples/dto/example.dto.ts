export interface ExampleEntity {
  id?: number,
  name: string
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
}
