import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity, IBaseEntity } from '../../../core/base/entity/base.entity';
import { UseDTO } from '../../../core/base/decorator/use-dto.decorator';
import { GroupDTO } from '../dtos/group.dto';
import { GroupMembershipEntity } from './group-membership.entity';

export interface IGroupEntity extends IBaseEntity<GroupDTO> {
    name: string;
    description: string;
}
@Entity({ name: 'groups' })
@UseDTO(GroupDTO)
export class GroupEntity extends BaseEntity<GroupDTO> implements IGroupEntity {
    @Column({ name: 'name', unique: true })
    name: string;

    @Column({ name: 'description' })
    description: string;

    @OneToMany(
        () => GroupMembershipEntity,
        (groupMemberships) => groupMemberships.group
    )
    groupMemberships?: GroupMembershipEntity[];
}
