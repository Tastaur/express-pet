import { IsNotEmpty, IsString } from "class-validator";
import { VALIDATION_TYPE_MESSAGE } from "../../../globalConstants";


export class CreateExampleDto {
  @IsString({ message: VALIDATION_TYPE_MESSAGE.IS_STRING })
  @IsNotEmpty({ message: VALIDATION_TYPE_MESSAGE.IS_NOT_EMPTY })
    name: string;
}