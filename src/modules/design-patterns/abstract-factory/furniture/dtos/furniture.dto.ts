import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { ENUM_MATERIAL_TYPE } from '../constants/furniture.enum.constant';

export class FurnitureCreateDTO {
    @ApiProperty({
        name: 'type',
        description: 'Type of furniture',
        example: ENUM_MATERIAL_TYPE.PLASTIC,
        required: true,
        nullable: false,
    })
    @IsEnum(ENUM_MATERIAL_TYPE)
    @IsNotEmpty()
    @Type(() => String)
    type: ENUM_MATERIAL_TYPE;
}
