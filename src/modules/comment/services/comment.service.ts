import { Injectable } from '@nestjs/common';
import { CommentEntity } from '../entities/comment.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { instanceToPlain } from 'class-transformer';
import { CommentCreateDTO } from '../dtos/comment.create.dto';
import { PostService } from 'src/modules/post/services/post.service';

@Injectable()
export class CommentService {
    constructor(
        @InjectRepository(CommentEntity)
        private readonly commentRepo: Repository<CommentEntity>,
        private readonly postService: PostService
    ) {}

    async create(dto: CommentCreateDTO) {
        const { postId } = dto;

        await this.postService.getById(postId);
        const commentCreated = await this.commentRepo.save(
            this.commentRepo.create(dto)
        );

        return instanceToPlain({ data: commentCreated });
    }
}
