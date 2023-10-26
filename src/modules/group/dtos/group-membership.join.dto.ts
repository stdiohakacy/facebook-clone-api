import { ApiProperty, PickType } from '@nestjs/swagger';
import { GroupMembershipDTO } from './group-membership.dto';
import { faker } from '@faker-js/faker';
import { IsArray, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class GroupMembershipAuthJoinDTO extends PickType(GroupMembershipDTO, [
    'createdBy',
]) {
    @ApiProperty({
        name: 'memberIds',
        description: 'List member id of group membership',
        example: [faker.string.uuid(), faker.string.uuid()],
        required: true,
        nullable: false,
        type: [String],
    })
    @IsArray()
    @IsString({ each: true })
    @Type(() => Array)
    memberIds: string[];
}
