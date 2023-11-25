import { Injectable } from '@nestjs/common';
import { FurnitureCreateDTO } from '../dtos/furniture.dto';
import { FurnitureFactory } from '../factories/furniture.factory';

@Injectable()
export class FurnitureService {
    constructor() {}

    async create(dto: FurnitureCreateDTO) {
        const factory = FurnitureFactory.getFactory(dto.type);
        const chair = factory.createChair();
        chair.create();
        const table = factory.createTable();
        table.create();
    }
}
