import { Logger, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { AuthenticatedUserDto } from './auth-user.dto';

// Define o formato do payload que o JWT nos dará
interface JwtPayload {
  sub: string;
  email: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  private readonly logger = new Logger(JwtStrategy.name);

  constructor(private configService: ConfigService) {
    const secret = configService.get<string>('JWT_SECRET');

    if (!secret) {
      throw new Error('JWT_SECRET environment variable is not set. Cannot initialize JwtStrategy.');
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),

      ignoreExpiration: false,
      secretOrKey: secret,
    });
  }

  async validate(payload: JwtPayload): Promise<AuthenticatedUserDto> {
    this.logger.log(`Validating token for user: ${payload ? payload.email : 'No Payload'}`);

    if (!payload || !payload.sub) {
      this.logger.error('JWT Validation Failed: Missing payload or subject (sub).');
      throw new UnauthorizedException('Token inválido ou expirado.');
    }

    this.logger.log(`Token successfully validated for userId: ${payload.sub}`);

    return {
      userId: payload.sub,
      email: payload.email,
    };
  }
}
