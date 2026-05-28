import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';

type JwtPayload = {
  sub: string;
  email?: string;
  role?: string;
};

@Injectable()
export class TokenService {
  constructor(private readonly jwtService: JwtService) {}

  async generateAccessToken(payload: JwtPayload): Promise<string> {
    const secret = process.env.JWT_SECRET_KEY;
    const expiresIn = process.env.JWT_EXPIRES_IN || '1h';

    if (!secret) {
      throw new Error('JWT_SECRET_KEY is missing');
    }

    return this.jwtService.signAsync(payload, {
      secret,
      expiresIn: expiresIn as JwtSignOptions['expiresIn'],
    });
  }

  async generateRefreshToken(payload: JwtPayload): Promise<string> {
    const secret = process.env.JWT_REFRESH_SECRET;
    const expiresIn = process.env.JWT_REFRESH_EXPIRES_IN || '7d';

    if (!secret) {
      throw new Error('JWT_REFRESH_SECRET is missing');
    }

    return this.jwtService.signAsync(payload, {
      secret,
      expiresIn: expiresIn as JwtSignOptions['expiresIn'],
    });
  }

  async verifyRefreshToken(token: string): Promise<JwtPayload> {
    const secret = process.env.JWT_REFRESH_SECRET;

    if (!secret) {
      throw new Error('JWT_REFRESH_SECRET is missing');
    }

    try {
      return await this.jwtService.verifyAsync<JwtPayload>(token, {
        secret,
      });
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}
