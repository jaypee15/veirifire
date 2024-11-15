import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Badge, BadgeDocument } from './schemas/badge.schema';
import { Model, Schema as MongooseSchema } from 'mongoose';
import { CreateBadgeDto } from './dto/create-badge.dto';
import { v4 as uuidv4 } from 'uuid';
import {
  BadgeNotFoundException,
  BadgeAlreadyRevokedException,
} from '../../common/exceptions/badge.exceptions';

@Injectable()
export class BadgesService {
  constructor(
    @InjectModel(Badge.name) private badgeModel: Model<BadgeDocument>,
  ) {}

  async create(createBadgeDto: CreateBadgeDto): Promise<Badge> {
    const badgeId = uuidv4();
    const badge = new this.badgeModel({
      ...createBadgeDto,
      badgeId,
      issuedOn: new Date(),
      verification: {
        type: 'hosted',
        url: `${process.env.API_URL}/badges/verify/${badgeId}`,
      },
    });
    return badge.save();
  }

  async findAll(filter: Partial<Badge> = {}): Promise<Badge[]> {
    return this.badgeModel.find(filter).sort({ issuedOn: -1 }).exec();
  }

  async findByBadgeId(badgeId: string): Promise<Badge | null> {
    return this.badgeModel.findOne({ badgeId }).exec();
  }

  async findOne(id: MongooseSchema.Types.ObjectId): Promise<Badge> {
    const badge = await this.badgeModel.findById(id).exec();
    if (!badge) {
      throw new BadgeNotFoundException(id.toString());
    }
    return badge;
  }

  async findByRecipient(identity: string): Promise<Badge[]> {
    return this.badgeModel
      .find({
        'recipient.identity': identity,
        revoked: false,
      })
      .exec();
  }

  async findByIssuer(organizationId: string): Promise<Badge[]> {
    return this.badgeModel
      .find({
        'issuer.organizationId': organizationId,
      })
      .exec();
  }

  async revoke(
    id: MongooseSchema.Types.ObjectId,
    reason: string,
  ): Promise<Badge> {
    const badge = await this.badgeModel.findById(id);

    if (badge.revoked) {
      throw new BadgeAlreadyRevokedException(id.toString());
    }

    badge.revoked = true;
    badge.revocationReason = reason;
    return badge.save();
  }

  async verify(badgeId: string): Promise<{
    valid: boolean;
    status: string;
    badge?: Badge;
  }> {
    const badge = await this.findByBadgeId(badgeId);

    if (!badge) {
      return { valid: false, status: 'Badge not found' };
    }

    if (badge.revoked) {
      return {
        valid: false,
        status: `Badge revoked: ${badge.revocationReason}`,
        badge,
      };
    }

    if (badge.expires && badge.expires < new Date()) {
      return {
        valid: false,
        status: 'Badge has expired',
        badge,
      };
    }

    return { valid: true, status: 'Valid', badge };
  }

  async addEvidence(
    id: MongooseSchema.Types.ObjectId,
    evidence: Badge['evidence'][0],
  ): Promise<Badge> {
    const badge = await this.badgeModel.findById(id);

    if (!badge.evidence) {
      badge.evidence = [];
    }

    badge.evidence.push(evidence);
    return badge.save();
  }

  async search(query: string): Promise<Badge[]> {
    return this.badgeModel
      .find({
        $or: [
          { name: { $regex: query, $options: 'i' } },
          { description: { $regex: query, $options: 'i' } },
          { 'criteria.narrative': { $regex: query, $options: 'i' } },
        ],
      })
      .exec();
  }
}
