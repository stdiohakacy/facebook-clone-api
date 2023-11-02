import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FriendshipEntity } from '../entities/friendship.entity';
import { Repository } from 'typeorm';
import { UserEntity } from 'src/modules/user/entities/user.entity';
import { FriendshipRequestDTO } from '../dtos/friendship.request.dto';
import { UserService } from 'src/modules/user/services/user.service';
import { instanceToPlain } from 'class-transformer';
import { ENUM_FRIENDSHIP_STATUS } from '../constants/friendship.enum.constant';
import { ENUM_FRIENDSHIP_STATUS_CODE_ERROR } from '../constants/friendship.status-code.constant';
import { PaginationOmitListDTO } from 'src/core/pagination/dtos/pagination.list.dto';
import { PaginationService } from 'src/core/pagination/services/pagination.service';

@Injectable()
export class FriendshipService {
    constructor(
        private readonly userService: UserService,
        @InjectRepository(FriendshipEntity)
        private readonly friendshipRepo: Repository<FriendshipEntity>,
        private readonly paginationService: PaginationService
    ) {}

    async findPaging(fromUserId: string, pagination: PaginationOmitListDTO) {
        const { _limit, _offset, _order } = pagination;
        const friendships = await this.friendshipRepo.find({
            skip: _offset,
            take: _limit,
            where: [{ fromUserId }, { toUserId: fromUserId }],
            order: _order,
        });

        const total = friendships.length;
        const totalPage = this.paginationService.totalPage(total, _limit);
        return {
            _pagination: { total, totalPage },
            data: friendships,
        };
    }

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

    async acceptRequest(id: string) {
        const friendshipRequest = await this.friendshipRepo.findOne({
            where: { id },
        });

        if (!friendshipRequest) {
            throw new NotFoundException({
                statusCode:
                    ENUM_FRIENDSHIP_STATUS_CODE_ERROR.FRIENDSHIP_NOT_FOUND_ERROR,
                message: 'friendship.error.notFound',
            });
        }
        if (
            friendshipRequest.friendshipStatus !==
            ENUM_FRIENDSHIP_STATUS.PENDING
        ) {
            throw new BadRequestException({
                statusCode:
                    ENUM_FRIENDSHIP_STATUS_CODE_ERROR.FRIENDSHIP_STATUS_INVALID_ERROR,
                message: 'friendship.error.statusInvalid',
            });
        }

        await this.friendshipRepo.save(friendshipRequest.acceptRequest());
    }

    async rejectRequest(id: string) {
        const friendshipRequest = await this.friendshipRepo.findOne({
            where: { id },
        });

        if (!friendshipRequest) {
            throw new NotFoundException({
                statusCode:
                    ENUM_FRIENDSHIP_STATUS_CODE_ERROR.FRIENDSHIP_NOT_FOUND_ERROR,
                message: 'friendship.error.notFound',
            });
        }
        if (
            friendshipRequest.friendshipStatus !==
            ENUM_FRIENDSHIP_STATUS.PENDING
        ) {
            throw new BadRequestException({
                statusCode:
                    ENUM_FRIENDSHIP_STATUS_CODE_ERROR.FRIENDSHIP_STATUS_INVALID_ERROR,
                message: 'friendship.error.statusInvalid',
            });
        }

        await this.friendshipRepo.save(friendshipRequest.rejectRequest());
    }

    async revokeRequest(id: string) {
        const friendshipRequest = await this.friendshipRepo.findOne({
            where: { id },
        });

        if (!friendshipRequest) {
            throw new NotFoundException({
                statusCode:
                    ENUM_FRIENDSHIP_STATUS_CODE_ERROR.FRIENDSHIP_NOT_FOUND_ERROR,
                message: 'friendship.error.notFound',
            });
        }
        if (
            friendshipRequest.friendshipStatus !==
            ENUM_FRIENDSHIP_STATUS.PENDING
        ) {
            throw new BadRequestException({
                statusCode:
                    ENUM_FRIENDSHIP_STATUS_CODE_ERROR.FRIENDSHIP_STATUS_INVALID_ERROR,
                message: 'friendship.error.statusInvalid',
            });
        }

        try {
            await this.friendshipRepo.delete({ id });
        } catch (error) {
            console.error(error);
        }
    }
}
