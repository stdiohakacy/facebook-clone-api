import { faker } from '@faker-js/faker';
import { ApiProperty } from '@nestjs/swagger';
import { ResponseIdSerialization } from 'src/core/response/serializations/response.id.serialization';

export class NotificationGetSerialization extends ResponseIdSerialization {
    @ApiProperty({
        name: 'content',
        description: 'Content of notification',
        example: faker.string.uuid(),
        required: true,
        nullable: false,
    })
    readonly content: string;
}
