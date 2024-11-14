import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Badge, BadgeDocument } from './schemas/badge.schema';
import { Model, Schema as MongooseSchema } from 'mongoose';
import { CreateBadgeDto } from './dto/create-badge.dto';
import { v4 as uuidv4 } from 'uuid';
@Injectable()
export class BadgesService {
  constructor(
    @InjectModel(Badge.name) private badgeModel: Model<BadgeDocument>,
  ) {}
  async create(createBadgeDto: CreateBadgeDto): Promise<Badge> {
    const badge = new this.badgeModel({
      ...createBadgeDto,
      badgeId: uuidv4(),
      issuedOn: new Date(),
    });
    return badge.save();
  }

  async findAll(): Promise<Badge[]> {
    return this.badgeModel.find().exec();
  }

  async findOne(id: MongooseSchema.Types.ObjectId): Promise<Badge | null> {
    return this.badgeModel.findById(id).exec();
  }

  async revoke(
    id: MongooseSchema.Types.ObjectId,
    reason: string,
  ): Promise<Badge | null> {
    return this.badgeModel
      .findByIdAndUpdate(
        id,
        { revoked: true, revocationReason: reason },
        { new: true },
      )
      .exec();
  }
}
