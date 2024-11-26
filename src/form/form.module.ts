import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Form } from './form.entity';
import { FormService } from './form.service';
import { FormController } from './form.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Form])],
  providers: [FormService],
  controllers: [FormController],
})
export class FormModule {}
