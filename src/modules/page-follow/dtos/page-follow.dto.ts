import { faker } from '@faker-js/faker';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsUUID } from 'class-validator';
import { BaseDTO } from '../../../core/base/dto/base.dto';

export class PageFollowDTO extends BaseDTO {
    @ApiProperty({
        name: 'pageId',
        description: 'Page id of page follow',
        example: faker.lorem.sentence(),
        required: true,
        nullable: false,
    })
    @IsUUID()
    @IsNotEmpty()
    @Type(() => String)
    pageId: string;

    @ApiProperty({
        name: 'userId',
        description: 'User id of page follow',
        example: faker.string.uuid(),
        required: true,
        nullable: false,
    })
    @IsUUID()
    @IsNotEmpty()
    @Type(() => String)
    userId: string;
}
