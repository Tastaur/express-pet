import { IsEmail, IsNumber, IsOptional, IsString } from "class-validator";


export class UpdateUserDto {
  @IsOptional()
  @IsString({ message: 'Ожидаемый тип - string' })
    name?: string;

  @IsOptional()
  @IsNumber({},{ message: 'Ожидаемый тип - number' })
    age?: number;

  @IsOptional()
  @IsEmail({},{ message: 'Указан не корретный e-mail' })
    email?: string;

  @IsOptional()
    password?: string;
}