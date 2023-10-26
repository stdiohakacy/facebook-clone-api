import { faker } from '@faker-js/faker';
import { ApiProperty } from '@nestjs/swagger';
import { ResponseIdSerialization } from 'src/core/response/serializations/response.id.serialization';

export class GroupGetSerialization extends ResponseIdSerialization {
    @ApiProperty({
        name: 'name',
        description: 'Name of group',
        example: 'Group 01',
        required: true,
        nullable: false,
    })
    readonly userId: string;

    @ApiProperty({
        name: 'description',
        description: 'Description of group',
        example: faker.lorem.sentence(),
        required: true,
        nullable: false,
    })
    readonly description: string;
}
