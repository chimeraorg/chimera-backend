import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { LoginUseCase } from '@package/auth/application/login.use-case';
import { LoginRequestDto } from './login.request.dto';
import { LoginResponseDto } from './login.response.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly loginUseCase: LoginUseCase) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Autentica um usuário e retorna um token JWT' })
  @ApiResponse({
    status: 200,
    description: 'Login bem-sucedido.',
    type: LoginResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Credencais inválidas.',
  })
  async login(@Body() reqeustDto: LoginRequestDto): Promise<LoginResponseDto> {
    const output = await this.loginUseCase.execute({
      email: reqeustDto.email,
      passwordPlain: reqeustDto.password,
    });

    return { accessToken: output.accessToken };
  }
}
