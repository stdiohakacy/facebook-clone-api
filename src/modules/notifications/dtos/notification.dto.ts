import { faker } from '@faker-js/faker';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Exclude, Type } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { BaseDTO } from '../../../core/base/dto/base.dto';
import { ENUM_NOTIFICATION_STATUS } from '../constants/notification.enum.constant';

export class NotificationDTO extends BaseDTO {
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

    @ApiProperty({
        name: 'content',
        description: 'Content of notification',
        example: faker.lorem.sentence(),
        required: true,
        nullable: false,
    })
    @IsString()
    @IsNotEmpty()
    @Type(() => String)
    content: string;

    @ApiProperty({
        name: 'notificationStatus',
        description: 'Notification status',
        example: faker.lorem.sentence(),
        required: true,
        nullable: false,
    })
    @IsEnum(ENUM_NOTIFICATION_STATUS)
    @IsNotEmpty()
    @Type(() => String)
    notificationStatus: ENUM_NOTIFICATION_STATUS;
}
