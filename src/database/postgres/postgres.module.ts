import { Module } from '@nestjs/common';
import { ConfigModule,ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: async (
          configService: ConfigService,
        ): Promise<TypeOrmModuleOptions> => {
          return configService.get<TypeOrmModuleOptions>('typeormconfig');
        },
      }),
  ],
})
export class DatabaseModule {}
