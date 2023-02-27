import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { WsException } from '@nestjs/websockets';
import { AuthService } from 'src/auth/auth.service';
import { TokenPayload } from 'src/auth/strategy/jwt.strategy';

@Injectable()
export class SocketAuthGuard implements CanActivate {
  constructor(private moduleRef: ModuleRef) {}
  private authService: AuthService;

  async onModuleInit() {
    this.authService = this.moduleRef.get<AuthService>(AuthService, {
      strict: false,
    });
  }

  async canActivate(context: ExecutionContext) {
    const request = context.switchToWs().getClient();

    if (!request.handshake.auth.authorization)
      throw new WsException(new UnauthorizedException());

    const userData: TokenPayload =
      await this.authService.getUserFromAuthenticationToken(
        request.handshake.auth.authorization.split(' ')[1],
      );

    if (!userData) throw new WsException(new UnauthorizedException());

    request.user = userData;

    return true;
  }
}
