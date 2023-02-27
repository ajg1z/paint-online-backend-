import { PassportStrategy } from '@nestjs/passport';
import { ObjectId } from 'mongodb';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable } from '@nestjs/common';
import { JwtSecretKey } from '../auth.const';

export interface TokenPayload {
  _id: ObjectId;
  name: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: JwtSecretKey,
    });
  }

  async validate(payload: TokenPayload) {
    return { _id: payload._id, name: payload.name };
  }
}
