import { faker } from '@faker-js/faker';
import { ApiProperty } from '@nestjs/swagger';
import { ResponseIdSerialization } from 'src/core/response/serializations/response.id.serialization';

export class MessageGetSerialization extends ResponseIdSerialization {
    @ApiProperty({
        name: 'senderId',
        description: 'Sender id of message',
        example: faker.string.uuid(),
        required: true,
        nullable: false,
    })
    readonly senderId: string;

    @ApiProperty({
        name: 'receiverId',
        description: 'Receiver id of message',
        example: faker.string.uuid(),
        required: true,
        nullable: false,
    })
    readonly receiverId: string;

    @ApiProperty({
        name: 'friendshipId',
        description: 'Friendship id of message',
        example: faker.string.uuid(),
        required: false,
        nullable: true,
    })
    readonly friendshipId?: string;

    @ApiProperty({
        name: 'content',
        description: 'Content of message',
        example: faker.lorem.paragraph(),
        required: true,
        nullable: false,
    })
    readonly content: string;
}

// content: string;
