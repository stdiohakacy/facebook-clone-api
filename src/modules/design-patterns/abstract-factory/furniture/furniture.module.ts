import { Module } from '@nestjs/common';
import { FurnitureService } from './services/furniture.service';
@Module({
    providers: [FurnitureService],
    exports: [FurnitureService],
})
export class FurnitureModule {}
