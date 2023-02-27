import { ObjectId } from 'mongodb';
import { User } from 'src/user/user.entity';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { MemberRoom } from './room.types';

export type RoomDocument = HydratedDocument<Room>;

@Schema()
export class Room {
  _id: ObjectId;

  @Prop()
  name: string;

  @Prop({ default: null })
  password?: string;

  @Prop()
  members: MemberRoom[];

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  author: User;
}

export const RoomSchema = SchemaFactory.createForClass(Room);
