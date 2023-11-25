import { BadRequestException } from '@nestjs/common';
import { ENUM_MATERIAL_TYPE } from '../constants/furniture.enum.constant';
import { PlasticFactory } from './plastic.factory';
import { WoodFactory } from './wood.factory';
import { FurnitureAbstractFactory } from './furniture.abs.factory';

export class FurnitureFactory {
    static getFactory(type: ENUM_MATERIAL_TYPE): FurnitureAbstractFactory {
        switch (type) {
            case ENUM_MATERIAL_TYPE.PLASTIC:
                return new PlasticFactory();
            case ENUM_MATERIAL_TYPE.WOOD:
                return new WoodFactory();
            default:
                throw new BadRequestException('This furniture is unsupported');
        }
    }
}
