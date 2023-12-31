import { BaseEntity, IBaseEntity } from '../../../core/base/entity/base.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { UseDTO } from '../../../core/base/decorator/use-dto.decorator';
import { MessageDTO } from '../dto/message.dto';
import { UserEntity } from '../../../modules/user/entities/user.entity';
import { FriendshipEntity } from '../../../modules/friendship/entities/friendship.entity';
import { ENUM_MESSAGE_STATUS } from '../constants/message.enum.constant';

export interface IMessageEntity extends IBaseEntity<MessageDTO> {
    senderId: string;
    receiverId: string;
    content: string;
    friendshipId?: string;
    messageStatus: ENUM_MESSAGE_STATUS;
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

    @Column({ name: 'friendshipId', type: 'uuid' })
    friendshipId?: string;

    @Column({ name: 'content' })
    content: string;

    @Column({ name: 'messageStatus' })
    messageStatus: ENUM_MESSAGE_STATUS;

    @ManyToOne(() => UserEntity, (sender) => sender.f_messages)
    @JoinColumn({ name: 'senderId' })
    sender?: UserEntity;

    @ManyToOne(() => FriendshipEntity, (friendship) => friendship.messages)
    @JoinColumn({ name: 'friendshipId' })
    friendship?: FriendshipEntity;

    @ManyToOne(() => UserEntity, (receiver) => receiver.t_messages)
    @JoinColumn({ name: 'receiverId' })
    receiver?: UserEntity;

    // @ManyToOne(() => UserEntity, (toUser) => toUser.t_friendships)
    // @JoinColumn({ name: 'toUserId' })
    // toUser?: UserEntity;
}
