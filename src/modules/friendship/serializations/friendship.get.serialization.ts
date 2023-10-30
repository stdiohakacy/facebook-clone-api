import { faker } from '@faker-js/faker';
import { ApiProperty } from '@nestjs/swagger';
import { ResponseIdSerialization } from 'src/core/response/serializations/response.id.serialization';
import { ENUM_FRIENDSHIP_STATUS } from '../constants/friendship.enum.constant';

export class FriendshipGetSerialization extends ResponseIdSerialization {
    @ApiProperty({
        name: 'fromUserId',
        description: 'From user id of friendship',
        example: faker.string.uuid(),
        required: true,
        nullable: false,
    })
    readonly fromUserId: string;

    @ApiProperty({
        name: 'toUserId',
        description: 'From user id of friendship',
        example: faker.string.uuid(),
        required: true,
        nullable: false,
    })
    readonly toUserId: string;

    @ApiProperty({
        name: 'friendshipStatus',
        description: 'From user id of friendship',
        example: ENUM_FRIENDSHIP_STATUS.PENDING,
        required: true,
        nullable: false,
    })
    readonly friendshipStatus: ENUM_FRIENDSHIP_STATUS;
}
