import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { ENUM_ORDER_TYPE } from '../constants/order.enum.constant';
import { Type } from 'class-transformer';

export class OrderCreateDTO {
    @ApiProperty({
        name: 'type',
        description: 'Type of order',
        example: ENUM_ORDER_TYPE.STANDARD,
        required: true,
        nullable: false,
    })
    @IsEnum(ENUM_ORDER_TYPE)
    @IsNotEmpty()
    @Type(() => String)
    type: ENUM_ORDER_TYPE;
}
