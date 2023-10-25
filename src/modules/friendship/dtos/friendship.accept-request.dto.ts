import { PickType } from '@nestjs/swagger';
import { FriendshipDTO } from './friendship.dto';

export class FriendshipAcceptRequestDTO extends PickType(FriendshipDTO, [
    'id',
]) {}
