import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity, IBaseEntity } from '../../../core/base/entity/base.entity';
import { UseDTO } from '../../../core/base/decorator/use-dto.decorator';
import { GroupMembershipDTO } from '../dtos/group-membership.dto';
import { UserEntity } from '../../../modules/user/entities/user.entity';
import { GroupEntity } from './group.entity';

export interface IGroupMembershipEntity
    extends IBaseEntity<GroupMembershipDTO> {
    userId: string;
    groupId: string;
}
@Entity({ name: 'group_memberships' })
@UseDTO(GroupMembershipDTO)
export class GroupMembershipEntity
    extends BaseEntity<GroupMembershipDTO>
    implements IGroupMembershipEntity
{
    @Column({ name: 'userId' })
    userId: string;

    @Column({ name: 'groupId' })
    groupId: string;

    @ManyToOne(() => UserEntity, (user) => user.groupMemberships)
    @JoinColumn({ name: 'userId' })
    user?: UserEntity;

    @ManyToOne(() => GroupEntity, (group) => group.groupMemberships)
    @JoinColumn({ name: 'groupId' })
    group?: GroupEntity;
}
