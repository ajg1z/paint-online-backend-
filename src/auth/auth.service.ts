import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';
import { JwtSecretKey } from './auth.const';
import { AuthDto } from './dto/auth.dto';
import { TokenPayload } from './strategy/jwt.strategy';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async login(dto: AuthDto) {
    const user = await this.userService.findOne(dto);
    if (user) {
      return await this.outputAuthData(user);
    } else {
      throw new UnauthorizedException();
    }
  }

  async outputAuthData(user: TokenPayload) {
    const outputUser = {
      _id: user._id,
      name: user.name,
    };
    const accessToken = await this.jwtService.signAsync(outputUser);
    return {
      user: outputUser,
      accessToken,
    };
  }

  async registration(dto: AuthDto) {
    const newUser = await this.userService.createUser(dto);

    return await this.outputAuthData(newUser);
  }

  async getUserFromAuthenticationToken(token: string) {
    try {
      const payload: TokenPayload = await this.jwtService.verifyAsync(token, {
        secret: JwtSecretKey,
      });
      return payload;
    } catch (e) {
      return null;
    }
  }
}
