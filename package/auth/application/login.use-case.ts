import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import {
  IUserRepository,
  USER_REPOSITORY_TOKEN,
} from '@package/users/domain/user.repository.interface';
import {
  ICryptographyService,
  CRYPTOGRAPHY_SERVICE_TOKEN,
} from '@infra/security/cryptography.service.interface';

export interface LoginCommand {
  email: string;
  passwordPlain: string;
}

export interface LoginOutput {
  accessToken: string;
}

@Injectable()
export class LoginUseCase {
  constructor(
    @Inject(USER_REPOSITORY_TOKEN)
    private readonly userRepository: IUserRepository,

    @Inject(CRYPTOGRAPHY_SERVICE_TOKEN)
    private readonly cryptographyService: ICryptographyService,
    private readonly jwtService: JwtService,
  ) {}

  public async execute(command: LoginCommand): Promise<LoginOutput> {
    const user = await this.userRepository.findByEmail(command.email);

    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas.');
    }

    const passwordMatch = await this.cryptographyService.compare(
      command.passwordPlain,
      user.getPasswordHash(),
    );

    if (!passwordMatch) {
      throw new UnauthorizedException('Credenciais inválidas.');
    }

    const payload = {
      sub: user.getId(), // 'sub' (subject) é o padrão JWT
      email: user.getEmail(),
    };

    const accessToken = await this.jwtService.signAsync(payload);

    return { accessToken };
  }
}
