import { faker } from '@faker-js/faker';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Exclude, Type } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { BaseDTO } from '../../../core/base/dto/base.dto';

export class CommentDTO extends BaseDTO {
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

    @ApiHideProperty()
    @Exclude()
    postId: string;

    @ApiProperty({
        name: 'parentCommentId',
        description: 'Parent comment id of comment',
        example: faker.string.uuid(),
        required: false,
        nullable: true,
    })
    @IsUUID()
    @IsOptional()
    @Type(() => String)
    parentCommentId?: string;
}
