import { PickType } from '@nestjs/swagger';
import { FriendshipDTO } from './friendship.dto';

export class FriendshipRequestDTO extends PickType(FriendshipDTO, [
    'toUserId',
]) {}
