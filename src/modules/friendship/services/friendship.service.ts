import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FriendshipEntity } from '../entities/friendship.entity';
import { Repository } from 'typeorm';
import { UserEntity } from 'src/modules/user/entities/user.entity';
import { FriendshipRequestDTO } from '../dtos/friendship.request.dto';
import { UserService } from 'src/modules/user/services/user.service';
import { instanceToPlain } from 'class-transformer';
import { ENUM_FRIENDSHIP_STATUS } from '../constants/friendship.enum.constant';

@Injectable()
export class FriendshipService {
    constructor(
        private readonly userService: UserService,
        @InjectRepository(FriendshipEntity)
        private readonly friendshipRepo: Repository<FriendshipEntity>
    ) {}

    async request(user: UserEntity, dto: FriendshipRequestDTO) {
        const { id: fromUserId } = user;
        const { toUserId } = dto;
        await this.userService.getById(toUserId);

        const friendshipCreated = await this.friendshipRepo.save(
            this.friendshipRepo.create({
                fromUserId,
                ...dto,
                friendshipStatus: ENUM_FRIENDSHIP_STATUS.PENDING,
            })
        );

        return instanceToPlain({ data: friendshipCreated });
    }
}
