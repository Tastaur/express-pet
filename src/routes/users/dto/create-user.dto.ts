import { IsEmail, IsNotEmpty, IsNumber, IsString } from "class-validator";


export class CreateUserDto {
  @IsString({ message: 'Ожидаемый тип - string' })
  @IsNotEmpty({ message: "Поле не может быть пустым" })
    name: string;

  @IsNumber({}, { message: "Ожидаемый тип - number" })
  @IsNotEmpty({ message: "Поле не может быть пустым" })
    age: number;

  @IsEmail({ }, { message: "Некорректная почта" })
  @IsNotEmpty({ message: "Поле не может быть пустым" })
    email: string;

  @IsNotEmpty({ message: "Поле не может быть пустым" })
    password: string;
}