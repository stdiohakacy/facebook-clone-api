import { ApiTags } from '@nestjs/swagger';
import { Response } from 'src/core/response/decorators/response.decorator';
import { FacadeService } from '../services/facade.service';
import { DPUserPublicCreateDoc } from '../docs/facade.public.doc';
import { Controller, Post } from '@nestjs/common';

@ApiTags('modules.public.dp.user')
@Controller({ version: '1', path: '/dp/user' })
export class FacadePublicController {
    constructor(private readonly facadeService: FacadeService) {}

    @DPUserPublicCreateDoc()
    @Response('dpUser.create')
    @Post('/create')
    async create() {
        return await this.facadeService.getUserAndProcessPayment(
            '1',
            'order-01',
            100,
            'nguyendangduy2210@gmail.com'
        );
    }
}
