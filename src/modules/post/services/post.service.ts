import { Injectable, NotFoundException } from '@nestjs/common';
import { PostEntity } from '../entities/post.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PostCreateDTO } from '../dtos/post.create.dto';
import { UserService } from 'src/modules/user/services/user.service';
import { instanceToPlain } from 'class-transformer';
import { PostUpdateDTO } from '../dtos/post.update.dto';
import { ENUM_POST_STATUS_CODE_ERROR } from '../constants/post.status-code.constant';
import { PaginationOmitListDTO } from 'src/core/pagination/dtos/pagination.list.dto';
import { PaginationService } from 'src/core/pagination/services/pagination.service';
import {
    RMQProvider,
    RMQSubscription,
} from 'src/core/queue/rmq/decorators/rmq.decorators';
import {
    RMQ_ENUM_EXCHANGE_NAME,
    RMQ_ENUM_EXCHANGE_QUEUE_NAME,
    RMQ_ENUM_EXCHANGE_ROUTING_KEY,
} from 'src/core/queue/rmq/constants/rmq.enum.constant';
import { TRMQResponse } from 'src/core/queue/rmq/constants/rmq.constants';
import { RmqService } from 'src/core/queue/rmq/services/rmq.service';
import { RedisService } from 'src/core/cache/redis/services/redis.service';
import { ENUM_POST_EVENT_TYPE } from '../constants/post.eum.constant';
import { IRMQMessage } from 'src/core/queue/rmq/interfaces/rmq.interface';
@RMQProvider()
@Injectable()
export class PostService {
    constructor(
        @InjectRepository(PostEntity)
        private readonly postRepo: Repository<PostEntity>,
        private readonly userService: UserService,
        private readonly paginationService: PaginationService,
        private readonly rmqService: RmqService,
        private readonly redisService: RedisService
    ) {}

    async findPaging(userId: string, pagination: PaginationOmitListDTO) {
        const { _limit, _offset, _order } = pagination;
        const posts = await this.postRepo.find({
            skip: _offset,
            take: _limit,
            where: { userId },
            order: _order,
        });

        const total = posts.length;
        const totalPage = this.paginationService.totalPage(total, _limit);
        return {
            _pagination: { total, totalPage },
            data: posts,
        };
    }

    async getById(id: string) {
        const key = `post-${id}`;
        const cachedPost = await this.redisService.get(key);

        if (cachedPost) {
            return instanceToPlain({ data: cachedPost });
        }

        const post = await this.postRepo.findOne({ where: { id } });

        if (!post) {
            throw new NotFoundException({
                statusCode: ENUM_POST_STATUS_CODE_ERROR.POST_NOT_FOUND_ERROR,
                message: 'post.error.notFound',
            });
        }

        this.redisService.set(key, post, 24 * 60 * 60);

        return instanceToPlain({ data: post });
    }

    @RMQSubscription({
        exchange: RMQ_ENUM_EXCHANGE_NAME.REDIS_SYNC_POSTGRES,
        routingKey: RMQ_ENUM_EXCHANGE_ROUTING_KEY.REDIS_SYNC_POSTGRES,
        queue: RMQ_ENUM_EXCHANGE_QUEUE_NAME.REDIS_SYNC_POSTGRES,
    })
    async postSubscription(msg: IRMQMessage): Promise<TRMQResponse> {
        const { eventKey, payload } = msg;
        try {
            switch (eventKey) {
                case ENUM_POST_EVENT_TYPE.POST_CREATED:
                    const post = this.postRepo.create();

                    post.content = payload.content;
                    post.userId = payload.userId;

                    const postCreated = await this.postRepo.save(post);
                    this.redisService.set(
                        `post-${postCreated.id}`,
                        postCreated,
                        24 * 60 * 60
                    );
                    break;
                default:
                    break;
            }
            return 'ack';
        } catch (error) {
            console.error(
                `RmqRecieveService: example - ${JSON.stringify(error)}`
            );
            return 'nack';
        }
    }

    async create(dto: PostCreateDTO) {
        await this.userService.getById(dto.userId);
        this.rmqService.send(
            RMQ_ENUM_EXCHANGE_ROUTING_KEY.REDIS_SYNC_POSTGRES,
            { eventKey: ENUM_POST_EVENT_TYPE.POST_CREATED, payload: dto }
        );
    }

    async update(id: string, dto: PostUpdateDTO) {
        const post = await this.postRepo.findOne({ where: { id } });
        if (!post) {
            throw new NotFoundException({
                statusCode: ENUM_POST_STATUS_CODE_ERROR.POST_NOT_FOUND_ERROR,
                message: 'post.error.notFound',
            });
        }
        let postUpdated = null;
        try {
            postUpdated = await this.postRepo.update(id, dto);
        } catch (error) {
            console.error(error);
        }

        return instanceToPlain({ data: postUpdated });
    }

    async delete(id: string) {
        const post = await this.postRepo.findOne({ where: { id } });
        if (!post) {
            throw new NotFoundException({
                statusCode: ENUM_POST_STATUS_CODE_ERROR.POST_NOT_FOUND_ERROR,
                message: 'post.error.notFound',
            });
        }
        try {
            await this.postRepo.delete({ id });
        } catch (error) {
            console.error(error);
        }
    }
}
