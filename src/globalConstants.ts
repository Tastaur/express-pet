export const hourInMillisecond = 60 * 60 * 1000;

export enum ROUTE_NAME {
  EXAMPLE = 'example',
  USERS = 'users',
  PETS = 'pets'
}

export enum VALIDATION_TYPE_MESSAGE {
  IS_STRING = 'Field should be string',
  IS_NUMBER = 'Field should be number',
  IS_BOOLEAN = 'Field should be boolean',
  IS_EMAIL = 'Incorrect email',
  IS_NOT_EMPTY = 'Field is required'
}

export enum ENV_KEY {
  DATABASE_URL = 'DATABASE_URL', // url for database
  PORT = 'PORT', // port for up
  SALT = 'SALT', // salt for hash password
  SECRET = 'SECRET' // secret jwt word
}
