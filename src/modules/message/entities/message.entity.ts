import { BaseEntity, IBaseEntity } from '../../../core/base/entity/base.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { UseDTO } from '../../../core/base/decorator/use-dto.decorator';
import { MessageDTO } from '../dto/message.dto';
import { UserEntity } from '../../../modules/user/entities/user.entity';

export interface IMessageEntity extends IBaseEntity<MessageDTO> {
    senderId: string;
    receiverId: string;
    content: string;
}

@Entity({ name: 'messages' })
@UseDTO(MessageDTO)
export class MessageEntity
    extends BaseEntity<MessageDTO>
    implements IMessageEntity
{
    @Column({ name: 'senderId', type: 'uuid' })
    senderId: string;

    @Column({ name: 'receiverId', type: 'uuid' })
    receiverId: string;

    @Column({ name: 'content' })
    content: string;

    @ManyToOne(() => UserEntity, (sender) => sender.f_messages)
    @JoinColumn({ name: 'senderId' })
    sender?: UserEntity;

    @ManyToOne(() => UserEntity, (receiver) => receiver.t_messages)
    @JoinColumn({ name: 'receiverId' })
    receiver?: UserEntity;
}
