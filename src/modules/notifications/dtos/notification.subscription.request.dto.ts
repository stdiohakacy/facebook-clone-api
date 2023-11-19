import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
    IsBoolean,
    IsNotEmpty,
    IsString,
    MaxLength,
    MinLength,
} from 'class-validator';

export class NotificationSubscriptionRequestDTO {
    @ApiProperty({
        name: 'username',
        description: 'Username of notification subscription request',
        // example: faker.string.uuid(),
        required: true,
        nullable: false,
    })
    @IsString()
    @IsNotEmpty()
    @Type(() => String)
    username: string;

    @ApiProperty({
        name: 'token',
        description: 'Token of notification subscription request',
        // example: faker.string.uuid(),
        required: true,
        nullable: false,
    })
    @IsString()
    @IsNotEmpty()
    @Type(() => String)
    token: string;

    @ApiProperty({
        name: 'topic',
        description: 'Topic of notification subscription request',
        // example: faker.string.uuid(),
        required: true,
        nullable: false,
    })
    @IsString()
    @IsNotEmpty()
    @Type(() => String)
    @MinLength(4)
    @MaxLength(20)
    topic: string;

    @ApiProperty({
        name: 'subscribed',
        description: 'Is Subscribed of notification subscription request',
        // example: faker.string.uuid(),
        required: true,
        nullable: false,
    })
    @IsBoolean()
    @IsNotEmpty()
    @Type(() => Boolean)
    subscribed: boolean;
}
