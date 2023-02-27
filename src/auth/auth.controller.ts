import { TokenPayload } from 'src/auth/strategy/jwt.strategy';
import { JwtAuthGuard } from './guard/auth.guard';
import { UseGuards } from '@nestjs/common/decorators/core/use-guards.decorator';
import { Controller, Post, Get } from '@nestjs/common';
import { Body } from '@nestjs/common/decorators';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { User } from 'src/custom-decorators/user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/login')
  login(@Body() dto: AuthDto) {
    return this.authService.login(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/check-auth')
  checkAuth(@User() user: TokenPayload) {
    return this.authService.outputAuthData(user);
  }

  @Post('/registration')
  registration(@Body() dto: AuthDto) {
    return this.authService.registration(dto);
  }
}
