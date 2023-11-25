import { Injectable } from '@nestjs/common';
import { ProductBuilder } from '../product.builder';
import { Product } from '../entities/product.entity';

@Injectable()
export class ProductService {
    createProduct(name: string, price: number, description: string): Product {
        const productBuilder = new ProductBuilder();

        productBuilder.withName(name);
        productBuilder.withPrice(price);
        productBuilder.withDescription(description);

        return productBuilder.build();
    }
}
