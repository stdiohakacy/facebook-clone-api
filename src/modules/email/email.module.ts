import { Module } from '@nestjs/common';
import { EmailProviderFactory } from '../email/providers/email.provider.factory';
@Module({
    imports: [],
    providers: [EmailProviderFactory],
    controllers: [],
    exports: [EmailProviderFactory],
})
export class EmailModule {}
