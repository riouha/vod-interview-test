import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ITokenPayload } from '../types/token-payload.interface';

@Injectable()
export class AuthService extends PassportStrategy(Strategy) {
  constructor(private readonly jwtService: JwtService, configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('auth.jwtSecret'),
    });
  }

  generateToken(payload: ITokenPayload) {
    return this.jwtService.sign(payload);
  }

  async validate(payload: ITokenPayload) {
    // if (!payload.isActive) throw new ForbiddenException(new ErrorResponse('access denied'));
    return payload;
  }
}
