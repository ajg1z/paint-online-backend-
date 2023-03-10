import { ObjectId } from 'mongodb';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  _id: ObjectId;

  @Prop()
  name: string;

  @Prop()
  password: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
