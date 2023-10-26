import { BaseEntity, IBaseEntity } from '../../../core/base/entity/base.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { UseDTO } from '../../../core/base/decorator/use-dto.decorator';
import { NotificationDTO } from '../dtos/notification.dto';
import { UserEntity } from '../../../modules/user/entities/user.entity';
import { ENUM_NOTIFICATION_STATUS } from '../constants/notification.enum.constant';

export interface INotificationEntity extends IBaseEntity<NotificationDTO> {
    notificationStatus: ENUM_NOTIFICATION_STATUS;
    content: string;
    fromUserId: string;
    toUserId: string;
}

@Entity({ name: 'notifications' })
@UseDTO(NotificationDTO)
export class NotificationEntity
    extends BaseEntity<NotificationDTO>
    implements INotificationEntity
{
    @Column({ name: 'notificationStatus' })
    notificationStatus: ENUM_NOTIFICATION_STATUS;

    @Column({ name: 'content' })
    content: string;

    @Column({ name: 'fromUserId', type: 'uuid' })
    fromUserId: string;

    @Column({ name: 'toUserId', type: 'uuid' })
    toUserId: string;

    @ManyToOne(() => UserEntity, (fromUser) => fromUser.f_notifications)
    @JoinColumn({ name: 'fromUserId' })
    fromUser?: UserEntity;

    @ManyToOne(() => UserEntity, (toUser) => toUser.t_notifications)
    @JoinColumn({ name: 'toUserId' })
    toUser?: UserEntity;

    read() {
        this.notificationStatus = ENUM_NOTIFICATION_STATUS.READ;
        return this;
    }
}
