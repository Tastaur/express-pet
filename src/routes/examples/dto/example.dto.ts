export class ExampleDto {
  constructor(
    private readonly _id: number,
    private _name: string,
  ) {
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

  get plainObject() {
    return {
      id: this.id,
      name: this.name,
    };
  }
}