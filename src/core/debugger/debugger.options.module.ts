import { Module } from '@nestjs/common';
import { DebuggerOptionService } from 'src/core/debugger/services/debugger.options.service';

@Module({
    providers: [DebuggerOptionService],
    exports: [DebuggerOptionService],
    imports: [],
})
export class DebuggerOptionsModule {}
