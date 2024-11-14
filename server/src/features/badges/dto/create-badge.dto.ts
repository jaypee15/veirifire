import {
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';

class IssuerDto {
  @IsNotEmpty()
  @IsString()
  name: string;
  @IsUrl()
  url: string;
  @IsEmail()
  email: string;
  @IsNotEmpty()
  @IsString()
  organizationId: string;
}
export class CreateBadgeDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  image: string;

  @IsNotEmpty()
  criteria: {
    narative: string;
    requirements: string[];
  };

  @IsNotEmpty()
  issuer: IssuerDto;

  @IsNotEmpty()
  recipient: {
    identity: string;
    type: string;
    hashed: boolean;
    salt?: string;
  };

  @IsOptional()
  @IsArray()
  evidence?: {
    type: string;
    id: string;
    description: string;
  }[];
}
