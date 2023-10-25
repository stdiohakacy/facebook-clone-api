import { Injectable, NotFoundException } from '@nestjs/common';
import { CommentEntity } from '../entities/comment.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { instanceToPlain } from 'class-transformer';
import { CommentCreateDTO } from '../dtos/comment.create.dto';
import { PostService } from 'src/modules/post/services/post.service';
import { ENUM_COMMENT_STATUS_CODE_ERROR } from '../constants/comment.status-code.constant';
import { CommentUpdateDTO } from '../dtos/comment.update.dto';

@Injectable()
export class CommentService {
    constructor(
        @InjectRepository(CommentEntity)
        private readonly commentRepo: Repository<CommentEntity>,
        private readonly postService: PostService
    ) {}

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
}
