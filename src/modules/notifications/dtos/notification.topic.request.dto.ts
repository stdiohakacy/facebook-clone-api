import { IsEnum, IsString, MaxLength, MinLength } from 'class-validator';
import { ENUM_NOTIFICATION_TYPE } from '../constants/notification.enum.constant';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class NotificationTopicRequestDTO {
    @ApiProperty({
        name: 'title',
        description: 'Title of notification topic request',
        // example: faker.string.uuid(),
        required: true,
        nullable: false,
    })
    @IsString()
    @MinLength(4)
    @MaxLength(20)
    @Type(() => String)
    title: string;

    @ApiProperty({
        name: 'body',
        description: 'Body of notification topic request',
        // example: faker.string.uuid(),
        required: true,
        nullable: false,
    })
    @IsString()
    @MinLength(4)
    @MaxLength(250)
    @Type(() => String)
    body: string;

    @ApiProperty({
        name: 'notificationType',
        description: 'Type of notification topic request',
        // example: faker.string.uuid(),
        required: true,
        nullable: false,
    })
    @IsEnum(ENUM_NOTIFICATION_TYPE)
    notificationType: ENUM_NOTIFICATION_TYPE;

    @ApiProperty({
        name: 'topic',
        description: 'Topic of notification topic request',
        // example: faker.string.uuid(),
        required: true,
        nullable: false,
    })
    @IsString()
    @MinLength(4)
    @MaxLength(20)
    @Type(() => String)
    topic: string;

    @ApiProperty({
        name: 'username',
        description: 'Username of notification topic request',
        // example: faker.string.uuid(),
        required: true,
        nullable: false,
    })
    @IsString()
    @Type(() => String)
    username: string;
}
