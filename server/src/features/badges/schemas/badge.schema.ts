import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema()
export class VerificationObject {
  @Prop({ type: String, required: true, default: 'hosted' })
  type: string;

  @Prop({ type: String, required: true })
  url: string;
}

const VerificationObjectSchema =
  SchemaFactory.createForClass(VerificationObject);

@Schema()
export class Alignment {
  @Prop({ type: String, required: true })
  targetName: string;

  @Prop({ type: String, required: true })
  targetUrl: string;

  @Prop({ type: String })
  targetDescription?: string;

  @Prop({ type: String })
  targetFramework?: string;

  @Prop({ type: String })
  targetCode?: string;
}

const AlignmentSchema = SchemaFactory.createForClass(Alignment);

@Schema()
export class Evidence {
  @Prop({ type: String, required: true })
  type: string;

  @Prop({ type: String, required: true })
  id: string;

  @Prop({ type: String, required: true })
  description: string;

  @Prop({ type: String })
  narrative?: string;

  @Prop({ type: String })
  genre?: string;

  @Prop({ type: [String] })
  audience?: string[];
}

const EvidenceSchema = SchemaFactory.createForClass(Evidence);

@Schema()
export class Criteria {
  @Prop({ type: String, required: true })
  narrative: string;

  @Prop({ type: [String], required: true })
  requirements: string[];

  @Prop({ type: String })
  url?: string;
}

const CriteriaSchema = SchemaFactory.createForClass(Criteria);

@Schema()
export class Issuer {
  @Prop({ type: MongooseSchema.Types.ObjectId, required: true })
  organizationId: MongooseSchema.Types.ObjectId;

  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, required: true })
  url: string;

  @Prop({ type: String, required: true })
  email: string;

  @Prop({ type: String })
  description?: string;

  @Prop({ type: String })
  image?: string;
}

const IssuerSchema = SchemaFactory.createForClass(Issuer);

@Schema()
export class Recipient {
  @Prop({ type: String, required: true })
  identity: string;

  @Prop({
    type: String,
    required: true,
    enum: ['email', 'url', 'telephone', 'blockchain'],
  })
  type: string;

  @Prop({ type: Boolean, required: true })
  hashed: boolean;

  @Prop({ type: String })
  salt?: string;
}

const RecipientSchema = SchemaFactory.createForClass(Recipient);

@Schema({ timestamps: true })
export class Badge {
  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, required: true })
  description: string;

  @Prop({ type: String, required: true })
  image: string;

  @Prop({ type: CriteriaSchema, required: true })
  criteria: Criteria;

  @Prop({ type: IssuerSchema, required: true })
  issuer: Issuer;

  @Prop({ type: RecipientSchema, required: true })
  recipient: Recipient;

  @Prop({ type: [EvidenceSchema] })
  evidence?: Evidence[];

  @Prop({ type: [AlignmentSchema] })
  alignment?: Alignment[];

  @Prop({ type: VerificationObjectSchema })
  verification?: VerificationObject;

  @Prop({ type: String, required: true, unique: true })
  badgeId: string;

  @Prop({ type: Boolean, default: false })
  revoked: boolean;

  @Prop({ type: String })
  revocationReason?: string;

  @Prop({ type: Date })
  expires?: Date;

  @Prop({ type: Date, required: true })
  issuedOn: Date;

  @Prop({ type: Object })
  tags?: Record<string, any>;
}

export type BadgeDocument = Badge & Document;
export const BadgeSchema = SchemaFactory.createForClass(Badge);

// Indexes for better query performance
BadgeSchema.index({ badgeId: 1 });
BadgeSchema.index({ 'issuer.organizationId': 1 });
BadgeSchema.index({ 'recipient.identity': 1 });
BadgeSchema.index({ issuedOn: -1 });
BadgeSchema.index({ revoked: 1 });
