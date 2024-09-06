import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RedisCacheModule } from './database/redis/redis-cache.module';
import { MongoModule } from './database/mongo/mongo.module';
import { DatabaseModule } from './database/postgres/postgres.module';
import { CacheModule } from '@nestjs/cache-manager';
import { RequestMiddleware } from './common/middlewares/logger/request-logger.middleware';
import { ResponseMiddleware } from './common/middlewares/logger/response-logger.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      isGlobal: true,
      envFilePath: getEnvFilePath(),
    }),
    MongoModule,
    RedisCacheModule,
    DatabaseModule,
    CacheModule
  ],
  controllers: [],
  providers: [
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(RequestMiddleware, ResponseMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}

function getEnvFilePath() {
  return process.env.NODE_ENV === 'test' ? '.env.test' : '.env';
}
