import { IChair } from '../interfaces/chair.interface';
import { ITable } from '../interfaces/table.interface';

export abstract class FurnitureAbstractFactory {
    abstract createChair(): IChair;
    abstract createTable(): ITable;
}
