import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Form } from './entity/form.entity';
import { Locations } from './entity/locations.entity';
import { Vendors } from './entity/vendors.entity';
import { FormService } from './form.service';
import { FormController } from './form.controller';
import { Item } from './entity/item.entity';
import { User } from 'src/modules/users/auth/entity/user.entity';


@Module({
  imports: [TypeOrmModule.forFeature([Form, Item, Vendors, Locations, User])],
  providers: [FormService],
  controllers: [FormController],
})
export class FormModule {}
