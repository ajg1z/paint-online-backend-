import { ObjectId } from 'mongodb';

export interface MemberRoom {
  _id: ObjectId;
  name: string;
  role: MemberRole;
  isForbiddenDraw: boolean;
}

export enum MemberRole {
  ADMIN = 0,
  USER = 1,
}

export enum SocketEmit {
  CONNECT_ROOM = 'connect_room',
  UPDATE_ROOM = 'update_room',
}

export interface DrawPayload {
  roomId: string;
  params: Record<string, any>;
}

export interface RedoUndoPayload {
  roomId: string;
  image: string;
}

export interface SaveImagePayload {
  roomId: string;
  image: string;
}
