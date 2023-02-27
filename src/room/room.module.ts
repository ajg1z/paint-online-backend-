import { MongooseModule } from '@nestjs/mongoose';
import { RoomController } from './room.controller';
import { Module } from '@nestjs/common';
import { RoomGateway } from './room.gateway';
import { Room, RoomSchema } from './room.entity';
import { RoomService } from './room.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Room.name, schema: RoomSchema }]),
  ],
  controllers: [RoomController],
  providers: [RoomGateway, RoomService],
})
export class RoomModule {}
