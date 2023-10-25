import { faker } from '@faker-js/faker';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { BaseDTO } from '../../../core/base/dto/base.dto';

export class PostDTO extends BaseDTO {
    @ApiProperty({
        name: 'content',
        description: 'Content of post',
        example: faker.lorem.sentence(),
        required: true,
        nullable: false,
    })
    @IsString()
    @IsNotEmpty()
    @Type(() => String)
    content: string;

    @ApiProperty({
        name: 'userId',
        description: 'User id of post',
        example: faker.string.uuid(),
        required: true,
        nullable: false,
    })
    @IsUUID()
    @IsNotEmpty()
    @Type(() => String)
    userId: string;
}
