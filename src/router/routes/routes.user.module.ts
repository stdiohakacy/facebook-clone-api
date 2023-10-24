import { Module } from '@nestjs/common';
import { ApiKeyModule } from 'src/core/api-key/api-key.module';

@Module({
    controllers: [],
    providers: [],
    exports: [],
    imports: [ApiKeyModule],
})
export class RoutesUserModule {}
