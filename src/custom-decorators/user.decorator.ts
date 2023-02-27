import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { TokenPayload } from 'src/auth/strategy/jwt.strategy';

export const User = createParamDecorator(
  (_: unknown, ctx: ExecutionContext) => {
    return ctx.switchToHttp().getRequest().user as TokenPayload;
  },
);
