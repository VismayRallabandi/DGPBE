import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigModule } from '@nestjs/config';
import { CacheConfigFactory } from './redis.factory';
import { CacheService } from './redis.service';
import cacheConfig from 'src/configs/redis.config';

@Module({
  imports: [
    ConfigModule.forFeature(cacheConfig),
    CacheModule.registerAsync({
      imports: [ConfigModule],
      useClass: CacheConfigFactory,
    }),
  ],
  providers: [CacheService],
  exports: [CacheService, CacheModule],
})
export class RedisCacheModule {}
