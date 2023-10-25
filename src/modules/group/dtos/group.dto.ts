import { faker } from '@faker-js/faker';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { BaseDTO } from '../../../core/base/dto/base.dto';

export class GroupDTO extends BaseDTO {
    @ApiProperty({
        name: 'name',
        description: 'Name of group',
        example: 'Group 01',
        required: true,
        nullable: false,
    })
    @IsString()
    @IsNotEmpty()
    @Type(() => String)
    name: string;

    @ApiProperty({
        name: 'description',
        description: 'Description of group',
        example: faker.lorem.sentence(),
        required: true,
        nullable: false,
    })
    @IsString()
    @IsNotEmpty()
    @Type(() => String)
    description: string;
}
