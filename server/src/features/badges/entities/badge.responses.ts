import { ApiProperty } from '@nestjs/swagger';
import { Badge } from '../schemas/badge.schema';

export class BadgeResponse {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  image: string;

  @ApiProperty()
  badgeId: string;

  @ApiProperty()
  issuedOn: Date;

  @ApiProperty({ required: false })
  expires?: Date;

  @ApiProperty()
  revoked: boolean;

  @ApiProperty({ required: false })
  revocationReason?: string;

  @ApiProperty()
  criteria: {
    narrative: string;
    requirements: string[];
    url?: string;
  };

  @ApiProperty()
  issuer: {
    organizationId: string;
    name: string;
    url: string;
    email: string;
    description?: string;
    image?: string;
  };

  @ApiProperty()
  recipient: {
    identity: string;
    type: string;
    hashed: boolean;
    salt?: string;
  };
}

export class BadgeVerificationResponse {
  @ApiProperty()
  valid: boolean;

  @ApiProperty()
  status: string;

  @ApiProperty({ type: BadgeResponse, required: false })
  badge?: Badge;
}

export class BadgeListResponse {
  @ApiProperty({ type: [BadgeResponse] })
  badges: BadgeResponse[];

  @ApiProperty()
  total: number;
}
