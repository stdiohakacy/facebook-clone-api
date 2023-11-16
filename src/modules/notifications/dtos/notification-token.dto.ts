import { faker } from '@faker-js/faker';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { BaseDTO } from '../../../core/base/dto/base.dto';
import { ENUM_NOTIFICATION_TOKEN_STATUS } from '../constants/notification-token.enum.constant';

export class NotificationTokenDTO extends BaseDTO {
    @ApiProperty({
        name: 'deviceType',
        description: 'Type of device of notification token',
        example: 'web',
        required: true,
        nullable: false,
    })
    @IsString()
    @IsNotEmpty()
    @Type(() => String)
    deviceType: string;

    @ApiProperty({
        name: 'token',
        description: 'Token of notification token',
        example: faker.string.alphanumeric(100),
        required: true,
        nullable: false,
    })
    @IsString()
    @IsNotEmpty()
    @Type(() => String)
    token: string;

    @ApiProperty({
        name: 'notificationTokenStatus',
        description: 'Notification token status',
        example: ENUM_NOTIFICATION_TOKEN_STATUS.ACTIVE,
        required: true,
        nullable: false,
    })
    @IsEnum(ENUM_NOTIFICATION_TOKEN_STATUS)
    @IsNotEmpty()
    @Type(() => String)
    notificationTokenStatus: ENUM_NOTIFICATION_TOKEN_STATUS;

    @ApiProperty({
        name: 'userId',
        description: 'User id of notification token',
        example: faker.string.uuid(),
        required: true,
        nullable: false,
    })
    @IsUUID()
    @IsNotEmpty()
    @Type(() => String)
    userId: string;
}
