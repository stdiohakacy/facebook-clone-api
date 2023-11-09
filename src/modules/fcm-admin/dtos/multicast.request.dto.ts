import { ArrayMinSize, IsArray } from 'class-validator';
import { SingleRequestDTO } from './single.request.dto';

export class MulticastRequestDTO {
    @IsArray()
    @ArrayMinSize(1)
    subscribers: SingleRequestDTO[];

    @IsArray()
    @ArrayMinSize(1)
    tokens: string[];
}
