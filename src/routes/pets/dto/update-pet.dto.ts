import { IsBoolean, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { VALIDATION_TYPE_MESSAGE } from "../../../globalConstants";


export class UpdatePetDto {
  @IsOptional()
  @IsString({ message: VALIDATION_TYPE_MESSAGE.IS_STRING })
  @IsNotEmpty({ message: VALIDATION_TYPE_MESSAGE.IS_NOT_EMPTY })
    name?: string;

  @IsOptional()
  @IsBoolean({ message: VALIDATION_TYPE_MESSAGE.IS_BOOLEAN })
  @IsNotEmpty({ message: VALIDATION_TYPE_MESSAGE.IS_NOT_EMPTY })
    hasTail?: boolean;
}