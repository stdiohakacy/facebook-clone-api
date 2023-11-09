import { Type } from 'class-transformer';
import {
    IsBoolean,
    IsNotEmpty,
    IsString,
    MaxLength,
    MinLength,
} from 'class-validator';

export class SubscriptionRequestDTO {
    @IsString()
    @IsNotEmpty()
    username: string;

    @IsString()
    @IsNotEmpty()
    @Type(() => String)
    token: string;

    @IsString()
    @MinLength(4)
    @MaxLength(20)
    topic: string;

    @IsBoolean()
    subscribed: boolean;
}
