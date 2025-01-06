import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import ServerConfig from './configs/server.config';
//import { MongoModule } from './database/mongo/mongo.module';
import { DatabaseModule } from './database/postgres/postgres.module';
import { RequestMiddleware } from './common/middlewares/logger/request-logger.middleware';
//import { ApplicationModule } from './modules/application/application.module';
//import { KafkaModule } from './providers/infra/kafka/kafka.module';
//import { EventConsumerModule } from './events/consumers/consumer.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerModule } from 'nestjs-pino';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FormModule } from './modules/gatepasses/form/form.module';
import { Form } from './modules/gatepasses/form/entity/form.entity';
import { Item } from './modules/gatepasses/form/entity/item.entity';
import { User } from './modules/users/auth/entity/user.entity';
import { AuthKey } from './modules/users/auth/entity/auth-key.entity';
import { AuthModule } from './modules/users/auth/auth.module';
import { Locations } from './modules/gatepasses/form/entity/locations.entity';
import { Vendors } from './modules/gatepasses/form/entity/vendors.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      isGlobal: true,
      envFilePath: getEnvFilePath(),
      load: [ServerConfig],
    }),
    //MongoModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DBNAME,
      entities: [Form, Item, User, AuthKey,Locations,Vendors],
      synchronize: true, // Be careful with this in production
    }),
    AuthModule,
    FormModule, // This will be your form module
    DatabaseModule,
    LoggerModule.forRoot({
      pinoHttp: {
        transport: {
          target: 'pino-pretty',
          options: {
            singleLine: true
          }
        },
        quietReqLogger: true,  // Disable automatic request logging
        autoLogging: false, // Disable auto logging of requests
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(RequestMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}

function getEnvFilePath() {
  return process.env.NODE_ENV === 'test' ? '.env.test' : '.env';
}
