import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HealthModule } from 'src/health/health.module';
import { HealthPublicController } from 'src/health/controllers/health.public.controller';
import { MessagePublicController } from 'src/core/message/controllers/message.public.controller';
import { CqrsModule } from '@nestjs/cqrs';
import { UserPublicController } from 'src/modules/user/controllers/user.public.controller';
import { UserModule } from 'src/modules/user/user.module';

@Module({
    imports: [CqrsModule, UserModule, TerminusModule, HealthModule, UserModule],
    controllers: [
        HealthPublicController,
        MessagePublicController,
        UserPublicController,
    ],
    providers: [],
    exports: [],
})
export class RoutesPublicModule {}
