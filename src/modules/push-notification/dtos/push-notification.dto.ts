import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class PushNotificationSendDTO {
    @ApiProperty({
        name: 'title',
        description: 'Title of push notification',
        example: 'Test title',
        required: true,
        nullable: false,
    })
    @IsString()
    @IsNotEmpty()
    @Type(() => String)
    title: string;

    @ApiProperty({
        name: 'body',
        description: 'Body of push notification',
        example: 'Test body',
        required: true,
        nullable: false,
    })
    @IsString()
    @IsNotEmpty()
    @Type(() => String)
    body: string;
}
