import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { GenerateTokenPairUseCase, TokenPairOutput } from './generate-token-pair.use-case';

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

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface LoginOutput extends TokenPairOutput {}

@Injectable()
export class LoginUseCase {
  constructor(
    @Inject(USER_REPOSITORY_TOKEN)
    private readonly userRepository: IUserRepository,
    @Inject(CRYPTOGRAPHY_SERVICE_TOKEN)
    private readonly cryptographyService: ICryptographyService,
    private readonly generateTokenPairUseCase: GenerateTokenPairUseCase,
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

    return this.generateTokenPairUseCase.execute(user);
  }
}
