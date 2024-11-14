import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema()
class Criteria {
  @Prop({ required: true })
  narrative: string;

  @Prop({ required: true, type: [String] })
  requirements: string[];
}

const CriteriaSchema = SchemaFactory.createForClass(Criteria);

@Schema()
class Issuer {
  @Prop({ required: true })
  name: string;
  @Prop({ required: true })
  url: string;
  @Prop({ required: true })
  email: string;
  @Prop({ required: true })
  organizationId: MongooseSchema.Types.ObjectId;
}

const IssuerSchema = SchemaFactory.createForClass(Issuer);

class Recipient {
  @Prop({ required: true })
  identity: string;
  @Prop({ required: true })
  type: string;
  @Prop({ required: true })
  hashed: boolean;
  @Prop({ required: false })
  salt?: string;
}

const RecipientSchema = SchemaFactory.createForClass(Recipient);
@Schema({ timestamps: true })
export class Badge {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  image: string;

  @Prop({ required: true, type: CriteriaSchema })
  criteria: Criteria;

  @Prop({ required: true, type: IssuerSchema })
  issuer: Issuer;

  @Prop({ required: true, type: RecipientSchema })
  recipient: Recipient;

  @Prop({ default: false })
  revoked: boolean;

  @Prop()
  revocationReason?: string;

  @Prop()
  expires?: Date;

  @Prop({ required: true, unique: true })
  badgeId: string;

  @Prop({ type: Object })
  evidence?: {
    type: string;
    id: string;
    description: string;
  }[];
}

export type BadgeDocument = Badge & Document;
export const BadgeSchema = SchemaFactory.createForClass(Badge);

// Indexes
BadgeSchema.index({ badgeId: 1 });
BadgeSchema.index({ 'issuer.organization': 1 });
BadgeSchema.index({ 'recipient.identity': 1 });
