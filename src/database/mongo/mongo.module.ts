import { Module } from '@nestjs/common';
import { DatabaseFactory } from './mongo.factory';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import mongodbConfig from 'src/configs/mongodb.config';

@Module({

    imports: [
        ConfigModule.forFeature(mongodbConfig),
        MongooseModule.forRootAsync({
        imports: [ConfigModule],
        useClass: DatabaseFactory,
      }),
    ]
})
export class MongoModule {}
