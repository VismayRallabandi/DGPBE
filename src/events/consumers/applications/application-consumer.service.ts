import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConsumerService } from 'src/providers/infra/kafka/consumer.service';

@Injectable()
export class ApplicationConsumerService implements OnModuleInit {
  constructor(private readonly _consumer: ConsumerService) {}

  async onModuleInit() {
    this._consumer.addConsumer(
      'dev-scaffold-consumer-group',
      { topics: ['dev-scaffold-topic'] },
      {
        eachMessage: async ({ topic, partition, message }) => {
          console.log({
            source: 'create-consumer',
            message: message.value.toString(),
            partition: partition.toString(),
            topic: topic.toString(),
          });
        },
      },
    );
  }
}