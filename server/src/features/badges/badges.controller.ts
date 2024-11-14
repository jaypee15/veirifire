import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BadgesService } from './badges.service';
import { Badge } from './schemas/badge.schema';
import { CreateBadgeDto } from './dto/create-badge.dto';
import { Schema } from 'mongoose';

@ApiTags('Badges')
@Controller('badges')
export class BadgesController {
  constructor(private readonly badgesService: BadgesService) {}

  @ApiOperation({ summary: 'Creates a new Badge' })
  @ApiResponse({ status: 201, type: Badge })
  // @UseGuards(AuthGuard('jwt'))
  @Post()
  async create(@Body() createBadgeDto: CreateBadgeDto): Promise<Badge> {
    return this.badgesService.create(createBadgeDto);
  }

  @ApiOperation({ summary: 'Get all badges' })
  @ApiResponse({ status: 200, type: [Badge] })
  //   @UseGuards(AuthGuard('jwt'))
  @Get()
  async findAll(): Promise<Badge[]> {
    return this.badgesService.findAll();
  }

  @ApiOperation({ summary: 'Get a single badge by ID' })
  @ApiResponse({ status: 200, type: Badge })
  //   @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Badge | null> {
    return this.badgesService.findOne(new Schema.Types.ObjectId(id));
  }

  @ApiOperation({ summary: 'Revoke a badge' })
  @ApiResponse({ status: 200, type: Badge })
  //   @UseGuards(AuthGuard('jwt'))
  @Put(':id/revoke')
  async revoke(
    @Param('id') id: string,
    @Body('reason') reason: string,
  ): Promise<Badge | null> {
    return this.badgesService.revoke(new Schema.Types.ObjectId(id), reason);
  }
}
