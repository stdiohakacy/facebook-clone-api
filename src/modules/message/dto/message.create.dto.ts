import { PickType } from '@nestjs/swagger';
import { MessageDTO } from './message.dto';

export class MessageCreateDTO extends PickType(MessageDTO, [
    'senderId',
    'receiverId',
    'friendshipId',
    'content',
    'createdBy',
]) {}
