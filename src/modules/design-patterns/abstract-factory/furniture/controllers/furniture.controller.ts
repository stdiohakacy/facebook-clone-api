import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { FurnitureCreateDoc } from '../docs/furniture.doc';
import { FurnitureCreateDTO } from '../dtos/furniture.dto';
import { FurnitureService } from '../services/furniture.service';

@ApiTags('modules.public.furniture')
@Controller({ version: '1', path: '/furniture' })
export class FurnitureController {
    constructor(private readonly furnitureService: FurnitureService) {}

    @FurnitureCreateDoc()
    @Post('/')
    async create(@Body() dto: FurnitureCreateDTO) {
        return this.furnitureService.create(dto);
    }
}
