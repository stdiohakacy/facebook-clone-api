import { faker } from '@faker-js/faker';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Exclude, Type } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';
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

    @ApiHideProperty()
    @Exclude()
    userId: string;
}
