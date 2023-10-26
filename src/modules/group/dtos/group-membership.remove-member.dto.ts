import { PickType } from '@nestjs/swagger';
import { GroupMembershipDTO } from './group-membership.dto';

export class GroupMembershipRemoveMemberDTO extends PickType(
    GroupMembershipDTO,
    ['createdBy', 'userId', 'groupId']
) {}
