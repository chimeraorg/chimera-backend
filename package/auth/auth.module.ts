import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { UsersModule } from '@package/users/user.module';
import { SecurityModule } from '@infra/security/security.module';
import { LoginUseCase } from './application/login.use-case';
import { AuthController } from './interface/auth.controller';
import { JwtStrategy } from './interface/dto/jwt.strategy';
import { GenerateTokenPairUseCase } from './application/generate-token-pair.use-case';
import { RefreshTokensUseCase } from './application/refresh-tokens.use-case';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule, PassportModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRATION_TIME'),
        },
      }),
      inject: [ConfigService],
    }),
    PassportModule,
    forwardRef(() => UsersModule),
    SecurityModule,
  ],
  controllers: [AuthController],
  providers: [LoginUseCase, JwtStrategy, GenerateTokenPairUseCase, RefreshTokensUseCase],
  exports: [JwtModule, PassportModule],
})
export class AuthModule {}
