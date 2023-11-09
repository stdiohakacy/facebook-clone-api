import { faker } from '@faker-js/faker';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';
import { BaseDTO } from '../../../core/base/dto/base.dto';

export class SubscriberDTO extends BaseDTO {
    @ApiProperty({
        name: 'username',
        description: 'Username of subscriber',
        example: faker.internet.userName({
            firstName: faker.person.firstName(),
            lastName: faker.person.lastName(),
        }),
        required: true,
        nullable: false,
    })
    @IsString()
    @IsNotEmpty()
    @Type(() => String)
    username: string;

    @ApiProperty({
        name: 'token',
        description: 'Token of subscriber',
        example: faker.string.alphanumeric(20).toUpperCase(),
        required: true,
        nullable: false,
    })
    @IsString()
    @IsNotEmpty()
    @Type(() => String)
    token: string;

    @ApiProperty({
        name: 'topic',
        description: 'Topic of subscriber',
        required: true,
        nullable: false,
    })
    @IsString()
    @IsNotEmpty()
    @Type(() => String)
    topic: string;

    @ApiProperty({
        name: 'subscribed',
        description: 'Is subscribed',
        example: true,
        required: true,
        nullable: false,
    })
    @IsBoolean()
    @IsNotEmpty()
    @Type(() => Boolean)
    subscribed: boolean;
}
