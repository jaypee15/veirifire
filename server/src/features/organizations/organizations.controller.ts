import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { OrganizationsService } from './organizations.service';
import { Organization } from './schemas/organization.schema';
import { CreateOrganizationDto } from './dto/organizations.dto';
import {
  OrganizationResponse,
  OrganizationListResponse,
} from './entities/organization.responses';

@ApiTags('Organizations')
@Controller('organizations')
@ApiBearerAuth()
export class OrganizationsController {
  constructor(private readonly organizationService: OrganizationsService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new organization',
    description: 'Creates a new organization that can issue badges',
  })
  @ApiResponse({
    status: 201,
    description: 'Organization created successfully',
    type: OrganizationResponse,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid organization data provided',
  })
  async create(
    @Body() createOrganizationDto: CreateOrganizationDto,
  ): Promise<Organization> {
    try {
      return await this.organizationService.create(createOrganizationDto);
    } catch (error) {
      throw new HttpException(
        'Failed to create organization',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get()
  @ApiOperation({
    summary: 'Get all organizations',
    description: 'Retrieves a list of all registered organizations',
  })
  @ApiResponse({
    status: 200,
    description: 'List of organizations retrieved successfully',
    type: OrganizationListResponse,
  })
  async findAll(): Promise<Organization[]> {
    return this.organizationService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get organization by ID',
    description: 'Retrieves details of a specific organization',
  })
  @ApiParam({
    name: 'id',
    description: 'Organization ID',
    example: '507f1f77bcf86cd799439011',
  })
  @ApiResponse({
    status: 200,
    description: 'Organization retrieved successfully',
    type: OrganizationResponse,
  })
  @ApiResponse({
    status: 404,
    description: 'Organization not found',
  })
  async findOne(@Param('id') id: string): Promise<Organization | null> {
    const organization = await this.organizationService.findOne(id);
    if (!organization) {
      throw new HttpException('Organization not found', HttpStatus.NOT_FOUND);
    }
    return organization;
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Update organization',
    description: 'Updates details of an existing organization',
  })
  @ApiParam({
    name: 'id',
    description: 'Organization ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Organization updated successfully',
    type: OrganizationResponse,
  })
  @ApiResponse({
    status: 404,
    description: 'Organization not found',
  })
  async update(
    @Param('id') id: string,
    @Body() updateOrganDto: Partial<CreateOrganizationDto>,
  ) {
    const organization = await this.organizationService.update(
      id,
      updateOrganDto,
    );
    if (!organization) {
      throw new HttpException('Organization not found', HttpStatus.NOT_FOUND);
    }
    return organization;
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete organization',
    description: 'Removes an organization and all associated data',
  })
  @ApiParam({
    name: 'id',
    description: 'Organization ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Organization deleted successfully',
    type: OrganizationResponse,
  })
  @ApiResponse({
    status: 404,
    description: 'Organization not found',
  })
  async remove(@Param('id') id: string): Promise<Organization | null> {
    const organization = await this.organizationService.remove(id);
    if (!organization) {
      throw new HttpException('Organization not found', HttpStatus.NOT_FOUND);
    }
    return organization;
  }
}
