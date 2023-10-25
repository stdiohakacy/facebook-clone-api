import { faker } from '@faker-js/faker';
import { ApiProperty } from '@nestjs/swagger';
import { ResponseIdSerialization } from 'src/core/response/serializations/response.id.serialization';

export class CommentGetSerialization extends ResponseIdSerialization {
    @ApiProperty({
        name: 'content',
        description: 'Content of comment',
        example: faker.lorem.sentence(),
        nullable: false,
        required: true,
    })
    readonly content: string;
}
