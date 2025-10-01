import {
  Body,
  Controller,
  Post,
  UseInterceptors,
  ClassSerializerInterceptor,
  HttpCode,
  HttpStatus,
  Get,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { CreateUserRequestDto } from './create-user.request.dto';
import { UserResponseDto } from './user.response.dto';
import {
  CreateUserCommand,
  CreateUserUseCase,
} from '@package/users/application/create-user.use-case';
import { AuthGuard } from '@nestjs/passport';
import { AuthenticatedUserDto } from '@package/auth/interface/dto/auth-user.dto';

class ProfileResponseDto extends UserResponseDto {}

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly createUserUseCase: CreateUserUseCase) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Cria uma nova conta de usuário.' })
  @ApiResponse({
    status: 201,
    description: 'Usuário criado com sucesso.',
    type: UserResponseDto,
  })
  @ApiResponse({
    status: 409,
    description: 'Conflito: Usuário com este email já existe.',
  })
  @ApiResponse({
    status: 400,
    description: 'Requisição Inválida: Erros de validação (DTO)',
  })
  @UseInterceptors(ClassSerializerInterceptor)
  async create(@Body() requestDto: CreateUserRequestDto): Promise<UserResponseDto> {
    const command: CreateUserCommand = {
      email: requestDto.email,
      passwordPlain: requestDto.password,
      firstName: requestDto.firstName,
      lastName: requestDto.lastName,
    };

    const output = await this.createUserUseCase.execute(command);

    return new UserResponseDto(output);
  }

  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Retorna os dados do usuário autenticado (Requer token JWT)',
  })
  @ApiResponse({
    status: 200,
    description: 'Dados do perfil.',
    type: ProfileResponseDto,
  })
  @ApiResponse({
    status: 301,
    description: 'Não autorizado (Token ausente ou inválido).',
  })
  async getProfile(@Request() req: { user: AuthenticatedUserDto }): Promise<ProfileResponseDto> {
    const authenticatedUser = req.user;
    return {
      id: authenticatedUser.userId,
      email: authenticatedUser.email,
      fullName: 'Mocked Full Name',
      createdAt: new Date(),
    };
  }
}
