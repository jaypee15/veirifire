import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  ValidateNested,
} from 'class-validator';

class EvidenceDto {
  @ApiProperty({
    example: 'Assessment',
    description: 'Type of evidence provided',
  })
  @IsString()
  @IsNotEmpty()
  type: string;

  @ApiProperty({
    example: 'final-project-2024',
    description: 'Unique identifier for the evidence',
  })
  @IsString()
  @IsNotEmpty()
  id: string;

  @ApiProperty({
    example: 'Final project demonstrating mastery of advanced web development concepts',
    description: 'Detailed description of the evidence',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    example: 'Created a full-stack web application using React and NestJS',
    description: 'Optional narrative describing the evidence in detail',
    required: false,
  })
  @IsOptional()
  @IsString()
  narrative?: string;
}

class CriteriaDto {
  @ApiProperty({
    example: 'Complete all required coursework and final project with a grade of B or higher',
    description: 'Narrative description of what was required to earn the badge',
  })
  @IsString()
  @IsNotEmpty()
  narrative: string;

  @ApiProperty({
    example: [
      'Complete 12 modules of coursework',
      'Score 80% or higher on all assessments',
      'Submit and present final project',
    ],
    description: 'List of specific requirements that must be met',
  })
  @IsArray()
  @IsString({ each: true })
  requirements: string[];

  @ApiProperty({
    example: 'https://acme-university.edu/web-development/requirements',
    description: 'URL with additional information about criteria',
    required: false,
  })
  @IsOptional()
  @IsUrl()
  url?: string;
}

class IssuerDto {
  @ApiProperty({
    example: '507f1f77bcf86cd799439011',
    description: 'MongoDB ObjectId of the issuing organization',
  })
  @IsString()
  @IsNotEmpty()
  organizationId: string;

  @ApiProperty({
    example: 'Acme University',
    description: 'Name of the issuing organization',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'https://acme-university.edu',
    description: 'Official website of the issuing organization',
  })
  @IsUrl()
  url: string;

  @ApiProperty({
    example: 'certificates@acme-university.edu',
    description: 'Official email of the issuing organization',
  })
  @IsEmail()
  email: string;
}

class RecipientDto {
  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'Identity of the recipient (email, URL, or other identifier)',
  })
  @IsString()
  @IsNotEmpty()
  identity: string;

  @ApiProperty({
    example: 'email',
    description: 'Type of identity provided',
    enum: ['email', 'url', 'telephone', 'blockchain'],
  })
  @IsEnum(['email', 'url', 'telephone', 'blockchain'])
  type: string;

  @ApiProperty({
    example: false,
    description: 'Whether the identity value is hashed',
  })
  @IsBoolean()
  hashed: boolean;

  @ApiProperty({
    example: 'abc123',
    description: 'Salt used for hashing (if identity is hashed)',
    required: false,
  })
  @IsOptional()
  @IsString()
  salt?: string;
}

export class CreateBadgeDto {
  @ApiProperty({
    example: 'Advanced Web Development Certificate',
    description: 'Name of the badge',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'Certification for completing advanced web development course',
    description: 'Detailed description of what the badge represents',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    example: 'https://acme-university.edu/badges/web-dev-advanced.png',
    description: 'URL of the badge image',
  })
  @IsUrl()
  image: string;

  @ApiProperty({
    type: CriteriaDto,
    description: 'Criteria that must be met to earn the badge',
  })
  @ValidateNested()
  @Type(() => CriteriaDto)
  criteria: CriteriaDto;

  @ApiProperty({
    type: IssuerDto,
    description: 'Information about the organization issuing the badge',
  })
  @ValidateNested()
  @Type(() => IssuerDto)
  issuer: IssuerDto;

  @ApiProperty({
    type: RecipientDto,
    description: 'Information about the recipient of the badge',
  })
  @ValidateNested()
  @Type(() => RecipientDto)
  recipient: RecipientDto;

  @ApiProperty({
    type: [EvidenceDto],
    description: 'Evidence supporting the badge issuance',
    required: false,
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EvidenceDto)
  evidence?: EvidenceDto[];

  @ApiProperty({
    example: '2025-12-31T23:59:59Z',
    description: 'Date when the badge expires (if applicable)',
    required: false,
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  expires?: Date;
}
