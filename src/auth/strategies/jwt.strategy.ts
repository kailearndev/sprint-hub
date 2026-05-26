import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from '@/types/jwt-payload.type';
import type { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor() {
        const secret = process.env.JWT_SECRET_KEY;

        if (!secret) {
            throw new Error('JWT_SECRET_KEY is missing');
        }

        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                ExtractJwt.fromAuthHeaderAsBearerToken(),
                (request: Request) => request?.cookies?.accessToken,
            ]),
            ignoreExpiration: false,
            secretOrKey: secret,
        });

    }
    validate(payload: JwtPayload): JwtPayload {
        return payload;
    }
}
