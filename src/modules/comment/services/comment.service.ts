import { Injectable, NotFoundException } from '@nestjs/common';
import { CommentEntity } from '../entities/comment.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { instanceToPlain } from 'class-transformer';
import { CommentCreateDTO } from '../dtos/comment.create.dto';
import { PostService } from 'src/modules/post/services/post.service';
import { ENUM_COMMENT_STATUS_CODE_ERROR } from '../constants/comment.status-code.constant';
import { CommentUpdateDTO } from '../dtos/comment.update.dto';
import { PaginationOmitListDTO } from 'src/core/pagination/dtos/pagination.list.dto';
import { PaginationService } from 'src/core/pagination/services/pagination.service';

@Injectable()
export class CommentService {
    constructor(
        @InjectRepository(CommentEntity)
        private readonly commentRepo: Repository<CommentEntity>,
        private readonly postService: PostService,
        private readonly paginationService: PaginationService
    ) {}

    async findPaging(postId: string, pagination: PaginationOmitListDTO) {
        const { _limit, _offset, _order } = pagination;
        await this.postService.getById(postId);
        const comments = await this.commentRepo.find({
            skip: _offset,
            take: _limit,
            where: { postId },
            order: _order,
        });

        const total = comments.length;
        const totalPage = this.paginationService.totalPage(total, _limit);
        return {
            _pagination: { total, totalPage },
            data: comments,
        };
    }

    async create(dto: CommentCreateDTO) {
        const { postId, parentCommentId } = dto;

        if (parentCommentId) {
            const parentComment = await this.commentRepo.findOne({
                where: { id: parentCommentId },
            });

            if (!parentComment) {
                throw new NotFoundException({
                    statusCode:
                        ENUM_COMMENT_STATUS_CODE_ERROR.COMMENT_NOT_FOUND_ERROR,
                    message: 'comment.error.notFound',
                });
            }
        }
        await this.postService.getById(postId);
        const commentCreated = await this.commentRepo.save(
            this.commentRepo.create(dto)
        );

        return instanceToPlain({ data: commentCreated });
    }

    async update(id: string, dto: CommentUpdateDTO) {
        const comment = await this.commentRepo.findOne({ where: { id } });
        if (!comment) {
            throw new NotFoundException({
                statusCode:
                    ENUM_COMMENT_STATUS_CODE_ERROR.COMMENT_NOT_FOUND_ERROR,
                message: 'comment.error.notFound',
            });
        }
        const commentUpdated = await this.commentRepo.update(id, dto);
        return instanceToPlain({ data: commentUpdated });
    }

    async delete(id: string) {
        const comment = await this.commentRepo.findOne({ where: { id } });
        if (!comment) {
            throw new NotFoundException({
                statusCode:
                    ENUM_COMMENT_STATUS_CODE_ERROR.COMMENT_NOT_FOUND_ERROR,
                message: 'comment.error.notFound',
            });
        }

        const subComments = await this.commentRepo.find({
            where: { parentCommentId: id },
        });

        if (subComments.length) {
            await this.commentRepo.remove(subComments);
        }

        await this.commentRepo.delete({ id });
    }
}
