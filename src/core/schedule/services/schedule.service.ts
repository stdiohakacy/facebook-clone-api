import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class ScheduleService {
    @Cron(CronExpression.EVERY_SECOND)
    scheduleTest() {
        console.log('Schedule test');
    }
}
