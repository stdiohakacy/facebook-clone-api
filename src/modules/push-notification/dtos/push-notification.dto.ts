import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class PushNotificationSendDTO {
    @ApiProperty({
        name: 'token',
        description: 'Token of push notification',
        example:
            'APA91bHTUJ20My5m7VKwjuCq2eacCweSE9O8ZveKmF5shCzgDP97ayq0S0FBMiq6qGKMQWSfdNGhAS3hbaGa2akskBJ_xuNxWYBKR2RJPomdZ6Po37NyKnKEcdKd0R_wS7rJ9KkdsoaG',
        required: true,
        nullable: false,
    })
    @IsString()
    @IsNotEmpty()
    @Type(() => String)
    token: string;

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
        name: 'content',
        description: 'Content of push notification',
        example: 'Test content',
        required: true,
        nullable: false,
    })
    @IsString()
    @IsNotEmpty()
    @Type(() => String)
    body: string;
}
