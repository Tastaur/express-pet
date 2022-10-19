export enum ROUTE_NAME {
  EXAMPLE = 'example',
  USERS = 'users',
  PETS = 'pets'
}

export enum VALIDATION_TYPE_MESSAGE {
  IS_STRING = 'Ожидаемый тип - string',
  IS_NUMBER = 'Ожидаемый тип - number',
  IS_BOOLEAN = 'Ожидаемый тип - boolean',
  IS_EMAIL = 'Введён некорректный email',
  IS_NOT_EMPTY = 'Поле не может быть пустым'
}

export enum ENV_KEY {
  DATABASE_URL = 'DATABASE_URL',
  PORT = 'PORT',
  SALT = 'SALT'
}