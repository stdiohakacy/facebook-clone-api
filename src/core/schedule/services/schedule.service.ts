import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class ScheduleService {
    @Cron(CronExpression.EVERY_10_HOURS)
    scheduleTest() {
        console.log('Schedule test');
    }
}
