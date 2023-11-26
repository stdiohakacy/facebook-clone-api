import { Module } from '@nestjs/common';
import { DirectoryService } from './services/directory.service';
@Module({
    imports: [],
    providers: [DirectoryService],
    exports: [DirectoryService],
})
export class DirectoryModule {}
