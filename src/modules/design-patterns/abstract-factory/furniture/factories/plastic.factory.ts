import { PlasticChair } from '../interfaces/chair.interface';
import { PlasticTable } from '../interfaces/table.interface';
import { FurnitureAbstractFactory } from './furniture.abs.factory';

export class PlasticFactory extends FurnitureAbstractFactory {
    createChair() {
        return new PlasticChair();
    }
    createTable() {
        return new PlasticTable();
    }
}
