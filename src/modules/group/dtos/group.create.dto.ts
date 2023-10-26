import { PickType } from '@nestjs/swagger';
import { GroupDTO } from './group.dto';

export class GroupCreateDTO extends PickType(GroupDTO, [
    'name',
    'description',
    'createdBy',
]) {}
