import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User } from '@package/users/domain/user.entity';

export interface TokenPairOutput {
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresIn: string;
}

@Injectable()
export class GenerateTokenPairUseCase {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  public async execute(user: User): Promise<TokenPairOutput> {
    const basePayload = {
      sub: user.getId(),
      email: user.getEmail(),
    };

    const accessOptions = {
      secret: this.configService.get<string>('JWT_SECRET'),
      expiresIn: this.configService.get<string>('JWT_EXPIRATION_TIME') || '1h',
    };
    const accessToken = await this.jwtService.signAsync(basePayload, accessOptions);

    const refreshOptions = {
      secret: this.configService.get<string>('JWT_SECRET'),
      expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRATION_TIME') || '7d',
    };
    const refreshToken = await this.jwtService.signAsync(basePayload, refreshOptions);

    return {
      accessToken,
      refreshToken,
      accessTokenExpiresIn: accessOptions.expiresIn,
    };
  }
}
