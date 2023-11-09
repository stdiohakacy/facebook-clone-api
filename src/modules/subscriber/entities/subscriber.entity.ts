import { BaseEntity, IBaseEntity } from '../../../core/base/entity/base.entity';
import { Column, Entity } from 'typeorm';
import { UseDTO } from '../../../core/base/decorator/use-dto.decorator';
import { SubscriberDTO } from '../dtos/subscriber.dto';

export interface ISubscriberEntity extends IBaseEntity<SubscriberDTO> {
    username: string;
    token: string;
    topic: string;
    subscribed: boolean;
}

@Entity({ name: 'subscribers' })
@UseDTO(SubscriberDTO)
export class SubscriberEntity
    extends BaseEntity<SubscriberDTO>
    implements ISubscriberEntity
{
    @Column({ name: 'username' })
    username: string;

    @Column({ name: 'token' })
    token: string;

    @Column({ name: 'topic' })
    topic: string;

    @Column({ name: 'subscribed' })
    subscribed: boolean;
}
