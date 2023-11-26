import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'src/core/response/decorators/response.decorator';
import { DirectoryService } from '../services/directory.service';

@ApiTags('modules.public.directory')
@Controller({ version: '1', path: '/directory' })
export class DirectoryPublicController {
    constructor(private readonly directoryService: DirectoryService) {}

    @Response('directory.getRoot')
    @Get('/root')
    async getRoot() {
        return this.directoryService.getRootDirectory();
    }
}
