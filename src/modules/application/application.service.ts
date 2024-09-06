import { Injectable, HttpException } from '@nestjs/common';
import { CreateApplicationDto } from './dto/create-application.dto';
import { WWApplication } from './entities/application.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ApplicationService {
  constructor(
    @InjectRepository(WWApplication)
    private readonly applicationRepository: Repository<WWApplication>,
  ) {}
  async create(createApplicationDto: CreateApplicationDto) {
    const userData =
      await this.applicationRepository.create(createApplicationDto);
    return this.applicationRepository.save(userData);
  }

  async findAll() {
    return await this.applicationRepository.find();
  }

  async findOne(id: number) {
    const applicationData = await this.applicationRepository.findOneBy({ id });
    if (!applicationData) {
      throw new HttpException('User Not Found', 404);
    }
    return applicationData;
  }
}
