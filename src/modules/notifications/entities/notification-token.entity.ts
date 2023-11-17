import { BaseEntity, IBaseEntity } from '../../../core/base/entity/base.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { UseDTO } from '../../../core/base/decorator/use-dto.decorator';
import { UserEntity } from '../../../modules/user/entities/user.entity';
import { NotificationTokenDTO } from '../dtos/notification-token.dto';
import { IResult } from 'ua-parser-js';
import { ENUM_NOTIFICATION_TOKEN_STATUS } from '../constants/notification.enum.constant';

export interface INotificationTokenEntity
    extends IBaseEntity<NotificationTokenDTO> {
    deviceType: IResult;
    token: string;
    notificationTokenStatus: ENUM_NOTIFICATION_TOKEN_STATUS;
    userId: string;
}

@Entity({ name: 'notification-tokens' })
@UseDTO(NotificationTokenDTO)
export class NotificationTokenEntity
    extends BaseEntity<NotificationTokenDTO>
    implements INotificationTokenEntity
{
    @Column({ name: 'deviceType', type: 'jsonb' })
    deviceType: IResult;

    @Column({ name: 'token' })
    token: string;

    @Column({ name: 'notificationTokenStatus' })
    notificationTokenStatus: ENUM_NOTIFICATION_TOKEN_STATUS;

    @Column({ name: 'userId', type: 'uuid' })
    userId: string;

    @ManyToOne(() => UserEntity, (user) => user.notificationTokens)
    @JoinColumn({ name: 'userId' })
    user?: UserEntity;
}
