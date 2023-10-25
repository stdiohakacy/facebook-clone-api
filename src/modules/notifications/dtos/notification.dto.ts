import { faker } from '@faker-js/faker';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';
import { BaseDTO } from '../../../core/base/dto/base.dto';

export class NotificationDTO extends BaseDTO {
    @ApiProperty({
        name: 'userId',
        description: 'User id of notification',
        example: faker.string.uuid(),
        required: true,
        nullable: false,
    })
    @IsString()
    @IsNotEmpty()
    @Type(() => String)
    userId: string;

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
}
