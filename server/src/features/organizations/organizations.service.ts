import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  Organization,
  OrganizationDocument,
} from './schemas/organization.schema';
import { Model } from 'mongoose';
import { CreateOrganizationDto } from './dto/organizations.dto';

@Injectable()
export class OrganizationsService {
  constructor(
    @InjectModel(Organization.name)
    private organizationModel: Model<OrganizationDocument>,
  ) {}

  async create(
    createOrganizationDto: CreateOrganizationDto,
  ): Promise<Organization> {
    const organization = new this.organizationModel(createOrganizationDto);
    return organization.save();
  }

  async findAll(): Promise<Organization[]> {
    return this.organizationModel.find().exec();
  }

  async findOne(id: string): Promise<Organization | null> {
    return this.organizationModel.findById(id).exec();
  }

  async update(
    id: string,
    updateOrganizationDto: Partial<CreateOrganizationDto>,
  ): Promise<Organization | null> {
    return this.organizationModel
      .findByIdAndUpdate(id, updateOrganizationDto, { new: true })
      .exec();
  }

  async remove(id: string): Promise<Organization | null> {
    return this.organizationModel.findByIdAndDelete(id).exec();
  }
}
