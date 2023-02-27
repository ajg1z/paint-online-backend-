import { TokenPayload } from 'src/auth/strategy/jwt.strategy';
import { JwtAuthGuard } from './../auth/guard/auth.guard';
import { UseGuards } from '@nestjs/common/decorators/core/use-guards.decorator';
import { CreateRoomDto } from './dto/create-room.dto';
import { Controller, Post, Get, Query } from '@nestjs/common';
import { RoomService } from './room.service';
import { Body } from '@nestjs/common/decorators';
import { User } from 'src/custom-decorators/user.decorator';
import { SaveImagePayload } from './room.types';
import { Param } from '@nestjs/common/decorators/http/route-params.decorator';

@Controller('room')
export class RoomController {
  constructor(private roomService: RoomService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreateRoomDto, @User() user: TokenPayload) {
    return this.roomService.create(dto, user._id);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  search(@Query('query') query: string) {
    return this.roomService.search(query);
  }

  @UseGuards(JwtAuthGuard)
  @Post('image')
  saveImage(@Body() payload: SaveImagePayload) {
    return this.roomService.saveImage(payload.roomId, payload.image);
  }

  @UseGuards(JwtAuthGuard)
  @Get('image/:id')
  getImage(@Param('id') id: string) {
    return this.roomService.getImage(id);
  }
}
