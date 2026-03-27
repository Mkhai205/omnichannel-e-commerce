import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import type { Request } from 'express';
import type { JwtPayload } from './types/jwt-payload.type';
import { AUTH_COOKIE_CONFIG_KEY } from 'src/core/config/env.constant';

function extractTokenFromCookieOrHeader(
  request: Request,
  cookieName: string,
): string | null {
  const cookieValue = request.cookies?.[cookieName] as string | undefined;
  if (cookieValue) {
    return cookieValue;
  }

  const authHeader = request.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  return authHeader.slice(7);
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    const accessCookieName = configService.get<string>(
      'AUTH_COOKIE_ACCESS_NAME',
      AUTH_COOKIE_CONFIG_KEY.AUTH_COOKIE_ACCESS_NAME,
    );

    super({
      jwtFromRequest: (req: Request) =>
        extractTokenFromCookieOrHeader(req, accessCookieName),
      secretOrKey: configService.get<string>('JWT_ACCESS_SECRET', ''),
      ignoreExpiration: false,
      passReqToCallback: false,
    });
  }

  validate(payload: JwtPayload): JwtPayload {
    if (payload.tokenType !== 'access') {
      throw new UnauthorizedException('Invalid access token');
    }

    return payload;
  }
}
