import { PickType } from '@nestjs/swagger';
import { NotificationTokenDTO } from './notification-token.dto';

export class NotificationTokenAcceptPushDTO extends PickType(
    NotificationTokenDTO,
    ['token']
) {}
