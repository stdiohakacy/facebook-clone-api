import { DashboardDto } from 'src/core/dashboard/dtos/dashboard';
import { IDashboardStartAndEndDate } from 'src/core/dashboard/interfaces/dashboard.interface';

export interface IDashboardService {
    getStartAndEndDate(date?: DashboardDto): IDashboardStartAndEndDate;
    getPercentage(value: number, total: number): number;
}
