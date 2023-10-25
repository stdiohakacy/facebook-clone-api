import { Injectable, NotFoundException } from '@nestjs/common';
import { PostEntity } from '../entities/post.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PostCreateDTO } from '../dtos/post.create.dto';
import { UserService } from 'src/modules/user/services/user.service';
import { instanceToPlain } from 'class-transformer';
import { PostUpdateDTO } from '../dtos/post.update.dto';
import { ENUM_POST_STATUS_CODE_ERROR } from '../constants/post.status-code.constant';

@Injectable()
export class PostService {
    constructor(
        @InjectRepository(PostEntity)
        private readonly postRepo: Repository<PostEntity>,
        private readonly userService: UserService
    ) {}

    async getById(id: string) {
        const post = await this.postRepo.findOne({ where: { id } });
        if (!post) {
            throw new NotFoundException({
                statusCode: ENUM_POST_STATUS_CODE_ERROR.POST_NOT_FOUND_ERROR,
                message: 'post.error.notFound',
            });
        }

        return instanceToPlain({ data: post });
    }

    async create(dto: PostCreateDTO) {
        await this.userService.getById(dto.userId);
        const postCreated = await this.postRepo.save(this.postRepo.create(dto));
        return instanceToPlain({ data: postCreated });
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
