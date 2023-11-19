import { ArrayMinSize, IsArray } from 'class-validator';
import { NotificationSingleRequestDTO } from './notification.single.request.dto';

export class NotificationMulticastRequestDTO {
    @IsArray()
    @ArrayMinSize(1)
    subscribers: NotificationSingleRequestDTO[];

    @IsArray()
    @ArrayMinSize(1)
    tokens: string[];
}
