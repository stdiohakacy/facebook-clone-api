import { Module } from '@nestjs/common';
import { ProductService } from './services/product.service';
@Module({
    imports: [],
    providers: [ProductService],
    exports: [ProductService],
})
export class ProductModule {}
