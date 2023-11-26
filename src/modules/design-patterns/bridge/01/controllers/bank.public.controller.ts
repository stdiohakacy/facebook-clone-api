import { Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'src/core/response/decorators/response.decorator';
import { BankService } from '../services/bank.service';
import { BankPublicCreateDoc } from '../docs/bank.public.doc';

@ApiTags('modules.public.bank')
@Controller({ version: '1', path: '/bank' })
export class BankPublicController {
    constructor(private readonly bankService: BankService) {}

    @BankPublicCreateDoc()
    @Response('bank.create')
    @Post('/')
    async create() {
        return this.bankService.create();
    }
}
