import { faker } from '@faker-js/faker';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
    IsEnum,
    IsNotEmpty,
    IsString,
    MaxLength,
    MinLength,
} from 'class-validator';
import { ENUM_NOTIFICATION_TYPE } from '../constants/notification.enum.constant';

export class NotificationSingleRequestDTO {
    @ApiProperty({
        name: 'title',
        description: 'Title of post',
        example: faker.lorem.sentence(),
        required: true,
        nullable: false,
    })
    @IsString()
    @IsNotEmpty()
    @MinLength(4)
    @MaxLength(20)
    @Type(() => String)
    title: string;

    @ApiProperty({
        name: 'body',
        description: 'Body of post',
        example: faker.lorem.sentence(),
        required: true,
        nullable: false,
    })
    @IsNotEmpty()
    @IsString()
    @MinLength(4)
    @MaxLength(250)
    body: string;

    @ApiProperty({
        name: 'notificationType',
        description: 'Notification type of notification single request',
        example: ENUM_NOTIFICATION_TYPE.SINGLE,
        required: true,
        nullable: false,
    })
    @IsNotEmpty()
    @IsEnum(ENUM_NOTIFICATION_TYPE)
    notificationType: ENUM_NOTIFICATION_TYPE;

    @ApiProperty({
        name: 'topic',
        description: 'Topic of notification single request',
        // example: ENUM_NOTIFICATION_TYPE.SINGLE,
        required: true,
        nullable: false,
    })
    @IsNotEmpty()
    @IsString()
    @MinLength(4)
    @MaxLength(20)
    topic: string;

    @ApiProperty({
        name: 'username',
        description: 'Username of notification single request',
        // example: ENUM_NOTIFICATION_TYPE.SINGLE,
        required: true,
        nullable: false,
    })
    @IsNotEmpty()
    @IsString()
    username: string;

    @ApiProperty({
        name: 'token',
        description: 'Token of notification single request',
        // example: "",
        required: true,
        nullable: false,
    })
    @IsNotEmpty()
    @IsString()
    token: string;
}
