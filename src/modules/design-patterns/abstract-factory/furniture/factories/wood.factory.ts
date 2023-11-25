import { WoodChair } from '../interfaces/chair.interface';
import { WoodTable } from '../interfaces/table.interface';
import { FurnitureAbstractFactory } from './furniture.abs.factory';

export class WoodFactory extends FurnitureAbstractFactory {
    createChair() {
        return new WoodChair();
    }
    createTable() {
        return new WoodTable();
    }
}
