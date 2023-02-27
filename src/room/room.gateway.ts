import { ObjectId } from 'mongodb';
import { TokenPayload } from './../auth/strategy/jwt.strategy';
import { SocketAuthGuard } from './guard/socket-auth.guard';
import { UseGuards } from '@nestjs/common';
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  ConnectedSocket,
} from '@nestjs/websockets';
import { RoomService } from './room.service';
import { User } from 'src/custom-decorators/user.decorator';
import { Server, Socket } from 'socket.io';
import { WebSocketServer } from '@nestjs/websockets/decorators';
import { DrawPayload, RedoUndoPayload } from './room.types';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class RoomGateway {
  constructor(private roomService: RoomService) {}

  @WebSocketServer()
  server: Server;

  @UseGuards(SocketAuthGuard)
  @SubscribeMessage('connect_room')
  async connectRoom(
    @MessageBody('id') id: ObjectId,
    @User() user: TokenPayload,
    @ConnectedSocket() client: Socket,
  ) {
    const room = await this.roomService.connectRoom(id, user);
    if (!room) return null;
    const roomId = String(room._id);
    client.join(roomId);
    this.server.to(roomId).emit('update_room', room);
    return room;
  }

  @UseGuards(SocketAuthGuard)
  @SubscribeMessage('leave_room')
  async leaveRoom(
    @MessageBody('id') id: ObjectId,
    @User() user: TokenPayload,
    @ConnectedSocket() client: Socket,
  ) {
    const room = await this.roomService.leaveRoom(id, user);
    if (!room) return null;
    const roomId = String(room._id);
    client.leave(roomId);

    this.server.to(roomId).emit('update_room', room);
  }

  @UseGuards(SocketAuthGuard)
  @SubscribeMessage('draw')
  async draw(
    @MessageBody() params: DrawPayload,
    @ConnectedSocket() socket: Socket,
  ) {
    this.server.to(params.roomId).except(socket.id).emit('draw', params);
  }

  @UseGuards(SocketAuthGuard)
  @SubscribeMessage('redo_undo')
  async redoUndo(
    @MessageBody() params: RedoUndoPayload,
    @ConnectedSocket() socket: Socket,
  ) {
    this.server
      .to(params.roomId)
      .except(socket.id)
      .emit('redo_undo', params.image);
  }
}
