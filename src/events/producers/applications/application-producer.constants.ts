import { ApplicationEventEnum } from "src/modules/application/enums/application-event.enum";
import { KafkaTopicsEnum } from "src/providers/infra/kafka/enums/kafka-topics.enum";

export const applicationEventKafkaTopicMap = {
    [ApplicationEventEnum.Created] : KafkaTopicsEnum.DevScaffoldTopic,
    [ApplicationEventEnum.Updated] : KafkaTopicsEnum.DevScaffoldTopic
}