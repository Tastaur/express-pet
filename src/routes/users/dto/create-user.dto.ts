import { IsEmail, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { VALIDATION_TYPE_MESSAGE } from "../../../globalConstants";


export class CreateUserDto {
  @IsString({ message: VALIDATION_TYPE_MESSAGE.IS_STRING })
  @IsNotEmpty({ message: VALIDATION_TYPE_MESSAGE.IS_NOT_EMPTY })
    name: string;

  @IsNumber({}, { message: VALIDATION_TYPE_MESSAGE.IS_NUMBER })
  @IsNotEmpty({ message: VALIDATION_TYPE_MESSAGE.IS_NOT_EMPTY })
    age: number;

  @IsEmail({}, { message: VALIDATION_TYPE_MESSAGE.IS_EMAIL })
  @IsNotEmpty({ message: VALIDATION_TYPE_MESSAGE.IS_NOT_EMPTY })
    email: string;

  @IsNotEmpty({ message: VALIDATION_TYPE_MESSAGE.IS_NOT_EMPTY })
    password: string;
}