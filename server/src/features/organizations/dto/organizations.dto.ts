import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class CreateOrganizationDto {
  @ApiProperty({
    example: 'Acme University',
    description: 'The name of the organization',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'Leading institution in technology education and certification',
    description: 'A detailed description of the organization',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    example: 'https://acme-university.edu',
    description: 'The official website URL of the organization',
  })
  @IsUrl()
  @IsNotEmpty()
  url: string;

  @ApiProperty({
    example: 'contact@acme-university.edu',
    description: 'The official contact email of the organization',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
