import { Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'src/core/response/decorators/response.decorator';
import { TestPublicTestDoc } from '../docs/test.public.doc';
import { TestService } from '../services/test.service';

@ApiTags('modules.public.test')
@Controller({ version: '1', path: '/test' })
export class TestPublicController {
    constructor(private readonly testService: TestService) {}

    @TestPublicTestDoc()
    @Response('test.test')
    @Post('/test')
    async test() {
        return await this.testService.test();
    }
}
