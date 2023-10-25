import { BaseEntity, IBaseEntity } from '../../../core/base/entity/base.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { UseDTO } from '../../../core/base/decorator/use-dto.decorator';
import { NotificationDTO } from '../dtos/notification.dto';
import { UserEntity } from '../../../modules/user/entities/user.entity';

export interface INotificationEntity extends IBaseEntity<NotificationDTO> {
    content: string;
    userId: string;
}

@Entity({ name: 'notifications' })
@UseDTO(NotificationDTO)
export class NotificationEntity
    extends BaseEntity<NotificationDTO>
    implements INotificationEntity
{
    @Column({ name: 'content' })
    content: string;

    @Column({ name: 'userId', type: 'uuid' })
    userId: string;

    @ManyToOne(() => UserEntity, (user) => user.notifications)
    @JoinColumn({ name: 'userId' })
    user?: UserEntity;
}
