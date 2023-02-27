import { getImagePath } from './room.helpers';
import { ObjectId } from 'mongodb';
import { InjectModel } from '@nestjs/mongoose/dist';
import { CreateRoomDto } from './dto/create-room.dto';
import { Injectable } from '@nestjs/common';
import { Room, RoomDocument } from './room.entity';
import { TokenPayload } from 'src/auth/strategy/jwt.strategy';
import { MemberRole } from './room.types';
import { Model } from 'mongoose';
import { writeFile, readFile, open } from 'fs/promises';

@Injectable()
export class RoomService {
  constructor(@InjectModel(Room.name) private roomModel: Model<RoomDocument>) {}

  async create(dto: CreateRoomDto, userId: ObjectId) {
    return await this.roomModel.create({
      ...dto,
      author: userId,
    });
  }

  async search(query: string) {
    const payload: Record<string, any> = {};
    if (query) payload.name = new RegExp(query, 'i');

    return await this.roomModel
      .find(payload)
      .populate({ path: 'author', select: { name: 1, _id: 1 } })
      .exec();
  }

  async connectRoom(id: ObjectId, user: TokenPayload) {
    const room = await this.roomModel.findOne({ _id: id });
    if (!room) return null;
    room.members.push({
      ...user,
      isForbiddenDraw: false,
      role: room.author._id === user._id ? MemberRole.ADMIN : MemberRole.USER,
    });

    return await room.save();
  }

  async leaveRoom(id: ObjectId, user: TokenPayload) {
    const room = await this.roomModel.findOne({ _id: id });
    if (!room) return null;
    room.members = room.members.filter((member) => member._id !== user._id);

    return await room.save();
  }

  async saveImage(roomId: string, image: string) {
    const data = image.replace(`data:image/png;base64,`, '');

    await writeFile(getImagePath(`${roomId}.jpg`), data, 'base64');
    return true;
  }

  async getImage(roomId: string) {
    const path = getImagePath(`${roomId}.jpg`);

    const fileExist = await this.existFile(path);
    if (fileExist) {
      const file = await readFile(path);
      return `data:image/png;base64,` + file.toString('base64');
    } else {
      return false;
    }
  }

  async existFile(path: string) {
    try {
      const isExist = await open(path);
      return isExist;
    } catch (e) {
      return false;
    }
  }
}
