import { faker } from '@faker-js/faker';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsUUID } from 'class-validator';
import { BaseDTO } from '../../../core/base/dto/base.dto';
import { ENUM_FRIENDSHIP_STATUS } from '../constants/friendship.enum.constant';

export class FriendshipDTO extends BaseDTO {
    @ApiProperty({
        name: 'fromUserId',
        description: 'From user id',
        example: faker.string.uuid(),
        required: true,
        nullable: false,
    })
    @IsUUID()
    @IsNotEmpty()
    @Type(() => String)
    fromUserId: string;

    @ApiProperty({
        name: 'toUserId',
        description: 'To user id',
        example: faker.string.uuid(),
        required: true,
        nullable: false,
    })
    @IsUUID()
    @IsNotEmpty()
    @Type(() => String)
    toUserId: string;

    @ApiProperty({
        name: 'friendShipStatus',
        description: 'Friendship status',
        example: ENUM_FRIENDSHIP_STATUS.PENDING,
        required: true,
        nullable: false,
    })
    @IsEnum(ENUM_FRIENDSHIP_STATUS)
    @IsNotEmpty()
    @Type(() => String)
    friendShipStatus: ENUM_FRIENDSHIP_STATUS;
}
