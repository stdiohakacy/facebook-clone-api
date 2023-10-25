import { faker } from '@faker-js/faker';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { BaseDTO } from '../../../core/base/dto/base.dto';

export class GroupMembershipDTO extends BaseDTO {
    @ApiProperty({
        name: 'userId',
        description: 'User id of group membership',
        example: faker.string.uuid(),
        required: true,
        nullable: false,
    })
    @IsString()
    @IsNotEmpty()
    @Type(() => String)
    userId: string;

    @ApiProperty({
        name: 'groupId',
        description: 'Group id of group membership',
        example: faker.string.uuid(),
        required: true,
        nullable: false,
    })
    @IsString()
    @IsNotEmpty()
    @Type(() => String)
    groupId: string;
}
