import { IsEnum, IsString, MaxLength, MinLength } from 'class-validator';
import { ENUM_NOTIFICATION_TYPE } from 'src/modules/notifications/constants/notification.enum.constant';

export class SingleRequestDTO {
    @IsString()
    @MinLength(4)
    @MaxLength(20)
    title: string;

    @IsString()
    @MinLength(4)
    @MaxLength(250)
    content: string;

    @IsEnum(ENUM_NOTIFICATION_TYPE)
    @IsString()
    notificationType: ENUM_NOTIFICATION_TYPE;

    @IsString()
    @MinLength(4)
    @MaxLength(20)
    topic: string;

    @IsString()
    username: string;

    @IsString()
    token: string;
}
