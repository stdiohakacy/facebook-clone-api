import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity, IBaseEntity } from '../../../core/base/entity/base.entity';
import { UseDTO } from '../../../core/base/decorator/use-dto.decorator';
import { FriendshipDTO } from '../dtos/friendship.dto';
import { ENUM_FRIENDSHIP_STATUS } from '../constants/friendship.enum.constant';
import { UserEntity } from '../../../modules/user/entities/user.entity';

export interface IFriendshipEntity extends IBaseEntity<FriendshipDTO> {
    fromUserId: string;
    toUserId: string;
    friendshipStatus: ENUM_FRIENDSHIP_STATUS;
}

@Entity({ name: 'friendships' })
@UseDTO(FriendshipDTO)
export class FriendshipEntity
    extends BaseEntity<FriendshipDTO>
    implements IFriendshipEntity
{
    @Column({ name: 'fromUserId', type: 'uuid' })
    fromUserId: string;

    @Column({ name: 'toUserId', type: 'uuid' })
    toUserId: string;

    @Column({ name: 'friendshipStatus' })
    friendshipStatus: ENUM_FRIENDSHIP_STATUS;

    @ManyToOne(() => UserEntity, (fromUser) => fromUser.f_friendships)
    @JoinColumn({ name: 'fromUserId' })
    fromUser?: UserEntity;

    @ManyToOne(() => UserEntity, (toUser) => toUser.t_friendships)
    @JoinColumn({ name: 'toUserId' })
    toUser?: UserEntity;

    acceptRequest() {
        this.friendshipStatus = ENUM_FRIENDSHIP_STATUS.ACCEPTED;
        return this;
    }

    rejectRequest() {
        this.friendshipStatus = ENUM_FRIENDSHIP_STATUS.REJECTED;
        return this;
    }
}
