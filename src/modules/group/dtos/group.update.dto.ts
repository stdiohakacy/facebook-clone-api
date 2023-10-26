import { PickType } from '@nestjs/swagger';
import { GroupDTO } from './group.dto';

export class GroupUpdateDTO extends PickType(GroupDTO, [
    'name',
    'description',
    'updatedBy',
]) {}
