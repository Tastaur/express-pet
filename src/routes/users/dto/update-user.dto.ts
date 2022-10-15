import { IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { VALIDATION_TYPE_MESSAGE } from "../../../globalConstants";


export class UpdateUserDto {
  @IsOptional()
  @IsString({ message: VALIDATION_TYPE_MESSAGE.IS_STRING })
  @IsNotEmpty({ message: VALIDATION_TYPE_MESSAGE.IS_NOT_EMPTY })
    name?: string;

  @IsOptional()
  @IsNumber({}, { message: VALIDATION_TYPE_MESSAGE.IS_NUMBER })
  @IsNotEmpty({ message: VALIDATION_TYPE_MESSAGE.IS_NOT_EMPTY })
    age?: number;

  @IsOptional()
  @IsEmail({}, { message: VALIDATION_TYPE_MESSAGE.IS_EMAIL })
  @IsNotEmpty({ message: VALIDATION_TYPE_MESSAGE.IS_NOT_EMPTY })
    email?: string;

  @IsOptional()
  @IsNotEmpty({ message: VALIDATION_TYPE_MESSAGE.IS_NOT_EMPTY })
    password?: string;
}