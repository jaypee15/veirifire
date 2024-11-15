import { ApiProperty } from '@nestjs/swagger';

export class OrganizationResponse {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  url: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class OrganizationListResponse {
  @ApiProperty({ type: [OrganizationResponse] })
  organizations: OrganizationResponse[];

  @ApiProperty()
  total: number;
}
