import { faker } from '@faker-js/faker';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';
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

    @ApiProperty({
        name: 'postId',
        description: 'Post id of post',
        example: faker.string.uuid(),
        required: true,
        nullable: false,
    })
    @IsUUID()
    @IsNotEmpty()
    @Type(() => String)
    postId: string;

    @ApiProperty({
        name: 'parentCommentId',
        description: 'Parent comment id of comment',
        example: faker.string.uuid(),
        required: true,
        nullable: false,
    })
    @IsUUID()
    @IsNotEmpty()
    @Type(() => String)
    parentCommentId: string;
}
