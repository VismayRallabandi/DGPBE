import { Injectable, HttpException, Inject, Logger } from '@nestjs/common';
import { applicationEventKafkaTopicMap as topicEventMap } from './application-producer.constants';
import { BaseProducerService } from '../base-producer.service';
import { ApplicationEventInterface } from 'src/modules/application/interfaces/application-event.interface';

@Injectable()
export class ApplicationEventProducerService extends BaseProducerService{
  private Applogger = new Logger(ApplicationEventProducerService.name);

  async publishEvent(event: ApplicationEventInterface) {
    try {
        await this.publishEventToKafka(
            {
                topic: topicEventMap[event.key],
                messages: [{
                    key: event.key,
                    value: JSON.stringify(event.value)
                }]
            }
          );
      return true
    } catch(e){
      this.Applogger.error("Exception while publishing application event to kafka", e.stack);
      return false
    }
  }
}