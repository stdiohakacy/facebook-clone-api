import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';
import { BaseDTO } from '../../../core/base/dto/base.dto';

export class PageDTO extends BaseDTO {
    @ApiProperty({
        name: 'name',
        description: 'Name of page',
        example: 'Page 01',
        required: true,
        nullable: false,
    })
    @IsString()
    @IsNotEmpty()
    @Type(() => String)
    name: string;

    @ApiProperty({
        name: 'description',
        description: 'Description of page',
        example: 'Page 01',
        required: true,
        nullable: false,
    })
    @IsString()
    @IsNotEmpty()
    @Type(() => String)
    description: string;
}
