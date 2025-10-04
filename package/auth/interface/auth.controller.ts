import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiProperty, ApiBody } from '@nestjs/swagger';
import { LoginUseCase } from '@package/auth/application/login.use-case';
import { LoginRequestDto } from './dto/login.request.dto';
import { LoginResponseDto } from './dto/login.response.dto';
import { IsString } from 'class-validator';
import { RefreshTokensUseCase } from '@package/auth/application/refresh-tokens.use-case';

class RefreshTokenRequestDto {
  @ApiProperty({
    description: 'The long duration refresh token obtained on login.',
    example: 'eyJ...',
  })
  @IsString()
  refreshToken!: string;
}

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly loginUseCase: LoginUseCase,
    private readonly refreshTokensUseCase: RefreshTokensUseCase,
  ) {}

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

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Renova Access Token e Refresh Token usando um Refresh Token válido.' })
  @ApiResponse({
    status: 200,
    description: 'Tokens renovados com sucesso.',
    type: LoginResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Refresh token inválido ou expirado.',
  })
  @ApiBody({ type: RefreshTokenRequestDto })
  async refreshToken(@Body() requestDto: RefreshTokenRequestDto): Promise<LoginResponseDto> {
    const output = await this.refreshTokensUseCase.execute({
      refreshToken: requestDto.refreshToken,
    });

    return {
      accessToken: output.accessToken,
      refreshToken: output.refreshToken,
    } as LoginResponseDto;
  }
}
