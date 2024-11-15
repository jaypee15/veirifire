import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { BadgesService } from './badges.service';
import { Badge } from './schemas/badge.schema';
import { CreateBadgeDto } from './dto/create-badge.dto';
import { Schema } from 'mongoose';
import {
  BadgeResponse,
  BadgeVerificationResponse,
  BadgeListResponse,
} from './entities/badge.responses';

@ApiTags('Badges')
@Controller('badges')
@ApiBearerAuth()
export class BadgesController {
  constructor(private readonly badgesService: BadgesService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new badge',
    description: 'Creates a new badge with the provided details',
  })
  @ApiResponse({
    status: 201,
    description: 'Badge created successfully',
    type: BadgeResponse,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid badge data provided',
  })
  async create(@Body() createBadgeDto: CreateBadgeDto): Promise<Badge> {
    try {
      return await this.badgesService.create(createBadgeDto);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get()
  @ApiOperation({
    summary: 'Get all badges or search badges',
    description: 'Retrieves all badges or searches badges based on query',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Search term for filtering badges',
  })
  @ApiResponse({
    status: 200,
    description: 'List of badges retrieved successfully',
    type: BadgeListResponse,
  })
  async findAll(@Query('search') search?: string): Promise<Badge[]> {
    if (search) {
      return this.badgesService.search(search);
    }
    return this.badgesService.findAll();
  }

  @Get('recipient/:identity')
  @ApiOperation({
    summary: 'Get badges by recipient',
    description: 'Retrieves all badges issued to a specific recipient',
  })
  @ApiParam({
    name: 'identity',
    description: 'Recipient identity (email, url, etc.)',
  })
  @ApiResponse({
    status: 200,
    description: 'List of recipient badges retrieved successfully',
    type: BadgeListResponse,
  })
  async findByRecipient(@Param('identity') identity: string): Promise<Badge[]> {
    return this.badgesService.findByRecipient(identity);
  }

  @Get('verify/:badgeId')
  @ApiOperation({
    summary: 'Verify a badge',
    description: 'Verifies the authenticity and validity of a badge',
  })
  @ApiParam({
    name: 'badgeId',
    description: 'Unique identifier of the badge',
  })
  @ApiResponse({
    status: 200,
    description: 'Badge verification result',
    type: BadgeVerificationResponse,
  })
  async verify(@Param('badgeId') badgeId: string) {
    return this.badgesService.verify(badgeId);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get a single badge',
    description: 'Retrieves a specific badge by its ID',
  })
  @ApiParam({
    name: 'id',
    description: 'Badge ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Badge retrieved successfully',
    type: BadgeResponse,
  })
  @ApiResponse({
    status: 404,
    description: 'Badge not found',
  })
  async findOne(@Param('id') id: string): Promise<Badge> {
    try {
      return await this.badgesService.findOne(new Schema.Types.ObjectId(id));
    } catch (error) {
      if (error.name === 'BadgeNotFoundException') {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      }
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Put(':id/revoke')
  @ApiOperation({
    summary: 'Revoke a badge',
    description: 'Revokes a previously issued badge',
  })
  @ApiParam({
    name: 'id',
    description: 'Badge ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Badge revoked successfully',
    type: BadgeResponse,
  })
  @ApiResponse({
    status: 400,
    description: 'Badge is already revoked',
  })
  async revoke(
    @Param('id') id: string,
    @Body('reason') reason: string,
  ): Promise<Badge> {
    try {
      return await this.badgesService.revoke(
        new Schema.Types.ObjectId(id),
        reason,
      );
    } catch (error) {
      if (error.name === 'BadgeAlreadyRevokedException') {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post(':id/evidence')
  @ApiOperation({ summary: 'Add evidence to a badge' })
  @ApiResponse({ status: 200, type: Badge })
  async addEvidence(
    @Param('id') id: string,
    @Body() evidence: Badge['evidence'][0],
  ): Promise<Badge> {
    return this.badgesService.addEvidence(
      new Schema.Types.ObjectId(id),
      evidence,
    );
  }
}
