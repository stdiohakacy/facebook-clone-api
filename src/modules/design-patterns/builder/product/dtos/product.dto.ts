import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class ProductCreateDTO {
    @ApiProperty({
        name: 'name',
        description: 'Name of product',
        example: 'Product 01',
        required: true,
        nullable: false,
    })
    @IsString()
    @IsNotEmpty()
    @Type(() => String)
    name: string;

    @ApiProperty({
        name: 'price',
        description: 'Price of product',
        example: 100,
        required: true,
        nullable: false,
    })
    @IsNumber()
    @IsNotEmpty()
    @Type(() => Number)
    price: number;

    @ApiProperty({
        name: 'description',
        description: 'Description of product',
        example: 'Description',
        required: true,
        nullable: false,
    })
    @IsString()
    @IsNotEmpty()
    @Type(() => String)
    description: string;
}
