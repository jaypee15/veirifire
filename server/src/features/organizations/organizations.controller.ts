import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { OrganizationsService } from './organizations.service';
import { Organization } from './schemas/organization.schema';
import { CreateOrganizationDto } from './dto/organizations.dto';

@ApiTags('Organizations')
@Controller('Organization')
export class OrganizationsController {
  constructor(private readonly organizationService: OrganizationsService) {}

  @ApiOperation({ summary: 'Create a new Organization' })
  @ApiResponse({ status: 201, type: Organization })
  @Post()
  async create(
    @Body() createOrganizationDto: CreateOrganizationDto,
  ): Promise<Organization> {
    return this.organizationService.create(createOrganizationDto);
  }

  @ApiOperation({ summary: 'Get all Organizations' })
  @ApiResponse({ status: 200, type: [Organization] })
  @Get()
  async findAll(): Promise<Organization[]> {
    return this.organizationService.findAll();
  }

  @ApiOperation({ summary: 'Get a single organization by ID' })
  @ApiResponse({ status: 200, type: Organization })
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Organization | null> {
    return this.organizationService.findOne(id);
  }

  @ApiOperation({ summary: 'Update an organization' })
  @ApiResponse({ status: 200, type: Organization })
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateOrganDto: Partial<CreateOrganizationDto>,
  ) {
    return this.organizationService.update(id, updateOrganDto);
  }

  @ApiOperation({ summary: 'Delete an organization' })
  @ApiResponse({ status: 200, type: Organization })
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<Organization | null> {
    return this.organizationService.remove(id);
  }
}
