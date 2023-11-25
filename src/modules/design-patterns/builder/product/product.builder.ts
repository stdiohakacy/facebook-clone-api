import { Product } from './entities/product.entity';

export class ProductBuilder {
    private product: Product;

    constructor() {
        this.product = new Product();
    }

    withName(name: string): ProductBuilder {
        this.product.name = name;
        return this;
    }

    withPrice(price: number): ProductBuilder {
        this.product.price = price;
        return this;
    }

    withDescription(description: string): ProductBuilder {
        this.product.description = description;
        return this;
    }

    build(): Product {
        return this.product;
    }
}
