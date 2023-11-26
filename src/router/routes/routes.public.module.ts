import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HealthModule } from 'src/health/health.module';
import { HealthPublicController } from 'src/health/controllers/health.public.controller';
import { MessagePublicController } from 'src/core/message/controllers/message.public.controller';
import { CqrsModule } from '@nestjs/cqrs';
import { UserPublicController } from 'src/modules/user/controllers/user.public.controller';
import { UserModule } from 'src/modules/user/user.module';
import { TestPublicController } from 'src/modules/test/controllers/test.public.controller';
import { TestModule } from 'src/modules/test/test.module';
import { MessageModule } from 'src/modules/message/message.module';
import { MessageAuthController } from 'src/modules/message/controllers/message.auth.controller';
import { OrderModule } from 'src/modules/design-patterns/factory-method/order/order.module';
import { OrderController } from 'src/modules/design-patterns/factory-method/order/controllers/order.controller';
import { FurnitureModule } from 'src/modules/design-patterns/abstract-factory/furniture/furniture.module';
import { FurnitureController } from 'src/modules/design-patterns/abstract-factory/furniture/controllers/furniture.controller';
import { ProductModule } from 'src/modules/design-patterns/builder/product/product.module';
import { ProductController } from 'src/modules/design-patterns/builder/product/controllers/product.controller';
import { BankModule } from 'src/modules/design-patterns/bridge/01/bank.module';
import { BankPublicController } from 'src/modules/design-patterns/bridge/01/controllers/bank.public.controller';
import { DirectoryModule } from 'src/modules/design-patterns/composite-pattern/01/directory.module';
import { DirectoryPublicController } from 'src/modules/design-patterns/composite-pattern/01/controllers/directory.public.controller';

@Module({
    imports: [
        CqrsModule,
        UserModule,
        TerminusModule,
        HealthModule,
        UserModule,
        MessageModule,
        OrderModule,
        FurnitureModule,
        ProductModule,
        BankModule,
        DirectoryModule,
        TestModule,
    ],
    controllers: [
        HealthPublicController,
        MessagePublicController,
        UserPublicController,
        MessageAuthController,
        TestPublicController,
        OrderController,
        FurnitureController,
        ProductController,
        BankPublicController,
        DirectoryPublicController,
    ],
    providers: [],
    exports: [],
})
export class RoutesPublicModule {}
