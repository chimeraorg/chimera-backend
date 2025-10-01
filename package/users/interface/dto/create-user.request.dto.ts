import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, MinLength, IsString, IsNotEmpty } from 'class-validator';

export class CreateUserRequestDto {
  @ApiProperty({
    description: 'Email único do usuário',
    example: 'john.doe@chimera.com',
  })
  @IsEmail({}, { message: 'O email deve ser um endereço de email válido.' })
  @IsNotEmpty({ message: 'Email é obrigatório' })
  readonly email: string = '';

  @ApiProperty({
    description: 'Senha (mínimo 8 caracteres)',
    example: 'SenhaForte123',
  })
  @IsString({ message: 'A senha deve ser uma string.' })
  @MinLength(8, { message: 'A senha deve ter no mínimo 8 caracteres.' })
  @IsNotEmpty({ message: 'Senha é obrigatória.' })
  readonly password: string = '';

  @ApiProperty({
    description: 'Primeiro nome de usuário',
    example: 'John',
  })
  @IsString({ message: 'O primeiro nome deve ser uma string.' })
  @IsNotEmpty({ message: 'Primeiro nome é obrigatório.' })
  readonly firstName: string = '';

  @ApiProperty({
    description: 'Sobrenome do usuário',
    example: 'Doe',
  })
  @IsString({ message: 'O sobrenome deve ser uma string.' })
  @IsNotEmpty({ message: 'Sobrenome é obrigatório.' })
  readonly lastName: string = '';
}
