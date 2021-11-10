import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { PUBLIC_KEY } from '../../utils/readKey';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: PUBLIC_KEY,
            algorithms: ['RS256'],
        });
    }

    async validate(payload: any) {
        return { userId: payload.sub, username: payload.username };
    }
}
