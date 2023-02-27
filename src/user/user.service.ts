import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose/dist';
import { Model } from 'mongoose';
import { AuthDto } from 'src/auth/dto/auth.dto';
import { User, UserDocument } from './user.entity';
import { ObjectId } from 'mongodb';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  findAll() {
    return this.userModel.find();
  }

  findById(id: ObjectId) {
    return this.userModel.findOne({ _id: id });
  }

  findOne(payload: AuthDto) {
    return this.userModel.findOne(payload);
  }

  async createUser(data: AuthDto) {
    return await this.userModel.create(data);
  }
}
