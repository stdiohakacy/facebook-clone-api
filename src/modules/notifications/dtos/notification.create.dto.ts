import { PickType } from '@nestjs/swagger';
import { NotificationDTO } from './notification.dto';

export class NotificationCreateDTO extends PickType(NotificationDTO, [
    'fromUserId',
    'toUserId',
    'content',
]) {}
