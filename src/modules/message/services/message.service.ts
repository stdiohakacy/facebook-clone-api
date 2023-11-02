import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationOmitListDTO } from 'src/core/pagination/dtos/pagination.list.dto';
import { MessageEntity } from '../entities/message.entity';
import { Repository } from 'typeorm';
import { PaginationService } from 'src/core/pagination/services/pagination.service';
import { MessageCreateDTO } from '../dto/message.create.dto';
import { EmptyMessageException } from '../exceptions/message.empty.exception';
import { EventEmitter2 } from '@nestjs/event-emitter';
import {
    ENUM_MESSAGE_EVENT_KEY,
    ENUM_MESSAGE_STATUS,
} from '../constants/message.enum.constant';

@Injectable()
export class MessageService {
    constructor(
        @InjectRepository(MessageEntity)
        private readonly messageRepo: Repository<MessageEntity>,
        private readonly paginationService: PaginationService,
        private readonly eventEmitter: EventEmitter2
    ) {}

    async findPaging(friendshipId: string, pagination: PaginationOmitListDTO) {
        const { _limit, _offset, _order } = pagination;
        const posts = await this.messageRepo.find({
            skip: _offset,
            take: _limit,
            where: { friendshipId },
            order: _order,
        });

        const total = posts.length;
        const totalPage = this.paginationService.totalPage(total, _limit);
        return {
            _pagination: { total, totalPage },
            data: posts,
        };
    }

    async updateStatus(id: string, messageStatus: ENUM_MESSAGE_STATUS) {
        await this.messageRepo.update(id, { messageStatus });
    }

    async create(dto: MessageCreateDTO) {
        const { content } = dto;
        if (!content) {
            throw new EmptyMessageException();
        }

        let messageCreated = null;

        try {
            messageCreated = await this.messageRepo.save({
                ...dto,
                ...{ messageStatus: ENUM_MESSAGE_STATUS.CREATED },
            });
        } catch (error) {
            console.error(error);
        }
        this.eventEmitter.emit(
            ENUM_MESSAGE_EVENT_KEY.MESSAGE_CREATE,
            messageCreated
        );

        return messageCreated;
    }
}
