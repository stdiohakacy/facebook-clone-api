import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { ScheduleService } from './services/schedule.service';

@Module({
    imports: [ScheduleModule.forRoot()],
    providers: [ScheduleService],
    exports: [ScheduleService, ScheduleModule.forRoot()],
})
export class ScheduleCoreModule {}
