import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ProductService } from '../services/product.service';
import { ProductCreateDTO } from '../dtos/product.dto';
import { ProductCreateDoc } from '../docs/product.doc';

@ApiTags('modules.public.product')
@Controller({ version: '1', path: '/product' })
export class ProductController {
    constructor(private readonly productService: ProductService) {}

    @ProductCreateDoc()
    @Post('/')
    async create(@Body() dto: ProductCreateDTO) {
        const { name, price, description } = dto;
        return this.productService.createProduct(name, price, description);
    }
}
