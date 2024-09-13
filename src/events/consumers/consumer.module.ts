import { Module } from '@nestjs/common';
import { KafkaModule } from 'src/providers/infra/kafka/kafka.module';
import { ApplicationConsumerService } from './applications/application-consumer.service';

@Module({
    imports: [
       KafkaModule
    ],
  providers: [ApplicationConsumerService],
})
export class EventConsumerModule {}