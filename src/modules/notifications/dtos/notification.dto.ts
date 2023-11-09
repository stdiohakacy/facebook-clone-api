import { faker } from '@faker-js/faker';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Exclude, Type } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { BaseDTO } from '../../../core/base/dto/base.dto';
import {
    ENUM_NOTIFICATION_STATUS,
    ENUM_NOTIFICATION_TYPE,
} from '../constants/notification.enum.constant';

export class NotificationDTO extends BaseDTO {
    @ApiProperty({
        name: 'topic',
        description: 'Topic of notification',
        // example: faker.string.string(),
        required: true,
        nullable: false,
    })
    @IsString()
    @IsNotEmpty()
    @Type(() => String)
    topic: string;

    @ApiProperty({
        name: 'username',
        description: 'Username of notification',
        // example: faker.string.uuid(),
        required: true,
        nullable: false,
    })
    @IsString()
    @IsNotEmpty()
    @Type(() => String)
    username: string;

    @ApiProperty({
        name: 'title',
        description: 'Title of notification',
        // example: faker.string.uuid(),
        required: true,
        nullable: false,
    })
    @IsString()
    @IsNotEmpty()
    @Type(() => String)
    title: string;

    @ApiProperty({
        name: 'content',
        description: 'Content of notification',
        // example: faker.string.uuid(),
        required: true,
        nullable: false,
    })
    @IsString()
    @IsNotEmpty()
    content: string;

    @ApiProperty({
        name: 'notificationType',
        description: 'Type of notification',
        // example: faker.string.uuid(),
        required: true,
        nullable: false,
    })
    @IsEnum(ENUM_NOTIFICATION_TYPE)
    @IsNotEmpty()
    notificationType: ENUM_NOTIFICATION_TYPE;

    @ApiProperty({
        name: 'notificationStatus',
        description: 'Status of notification',
        // example: faker.string.uuid(),
        required: true,
        nullable: false,
    })
    @IsString()
    @IsNotEmpty()
    notificationStatus: ENUM_NOTIFICATION_STATUS;

    @ApiHideProperty()
    @Exclude()
    fromUserId: string;

    @ApiProperty({
        name: 'toUserId',
        description: 'To user id of notification',
        example: faker.string.uuid(),
        required: true,
        nullable: false,
    })
    @IsUUID()
    @IsNotEmpty()
    @Type(() => String)
    toUserId: string;
}
