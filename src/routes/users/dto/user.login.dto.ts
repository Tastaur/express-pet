import { IsEmail, IsNotEmpty } from "class-validator";
import { VALIDATION_TYPE_MESSAGE } from "../../../globalConstants";


export class UserLoginDto {
  @IsEmail({}, { message: VALIDATION_TYPE_MESSAGE.IS_EMAIL })
  @IsNotEmpty({ message: VALIDATION_TYPE_MESSAGE.IS_NOT_EMPTY })
    email: string;

  @IsNotEmpty({ message: VALIDATION_TYPE_MESSAGE.IS_NOT_EMPTY })
    password: string;
}
