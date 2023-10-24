import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HealthModule } from 'src/health/health.module';
import { HealthPublicController } from 'src/health/controllers/health.public.controller';
import { MessagePublicController } from 'src/core/message/controllers/message.public.controller';
import { CqrsModule } from '@nestjs/cqrs';
import { UserPublicController } from 'src/modules/user/controllers/user.public.controller';
import { UserModule } from 'src/modules/user/user.module';
import { ParkingTicketModule } from 'src/modules/parking-ticket/parking-ticket.module';
import { ParkingTicketPublicController } from 'src/modules/parking-ticket/controllers/parking-ticket.public.controller';
import { ParkingSpotPublicController } from 'src/modules/parking-spot/controllers/parking-spot.public.controller';
import { ParkingSpotModule } from 'src/modules/parking-spot/parking-spot.module';
import { PaymentPublicController } from 'src/modules/payment/controllers/payment.public.controller';
import { PaymentModule } from 'src/modules/payment/payment.module';

@Module({
    imports: [
        CqrsModule,
        UserModule,
        TerminusModule,
        HealthModule,
        UserModule,
        ParkingTicketModule,
        ParkingSpotModule,
        PaymentModule,
    ],
    controllers: [
        HealthPublicController,
        MessagePublicController,
        UserPublicController,
        ParkingTicketPublicController,
        ParkingSpotPublicController,
        PaymentPublicController,
    ],
    providers: [],
    exports: [],
})
export class RoutesPublicModule {}
