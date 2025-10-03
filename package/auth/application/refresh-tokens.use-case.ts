import { Injectable, UnauthorizedException, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import {
  IUserRepository,
  USER_REPOSITORY_TOKEN,
} from '@package/users/domain/user.repository.interface';
import { GenerateTokenPairUseCase, TokenPairOutput } from './generate-token-pair.use-case';

export interface RefreshTokenCommand {
  refreshToken: string;
}

@Injectable()
export class RefreshTokensUseCase {
  constructor(
    private readonly jwtService: JwtService,
    private readonly generateTokenPairUseCase: GenerateTokenPairUseCase,
    @Inject(USER_REPOSITORY_TOKEN)
    private readonly userRepository: IUserRepository,
  ) {}
  public async execute(command: RefreshTokenCommand): Promise<TokenPairOutput> {
    try {
      const payload = await this.jwtService.verifyAsync(command.refreshToken);
      const userId = payload.sub;
      const user = await this.userRepository.findById(userId);

      if (!user) {
        throw new UnauthorizedException('Refresh token invalid (User not found.');
      }

      return this.generateTokenPairUseCase.execute(user);
    } catch (error) {
      throw new UnauthorizedException(`Refresh token invalid or expired.`);
    }
  }
}
