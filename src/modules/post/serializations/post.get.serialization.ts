import { faker } from '@faker-js/faker';
import { ApiProperty } from '@nestjs/swagger';
import { ResponseIdSerialization } from 'src/core/response/serializations/response.id.serialization';

export class PostGetSerialization extends ResponseIdSerialization {
    @ApiProperty({
        name: 'userId',
        description: 'User id of post',
        example: faker.string.uuid(),
        required: true,
        nullable: false,
    })
    readonly userId: string;

    @ApiProperty({
        name: 'content',
        description: 'Content of post',
        example: faker.lorem.sentence(),
        required: true,
        nullable: false,
    })
    readonly content: string;
}
