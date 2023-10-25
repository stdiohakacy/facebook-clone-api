import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../user/user.module';
import { CommentEntity } from './entities/comment.entity';
import { CommentService } from './services/comment.service';
import { PostModule } from '../post/post.module';
@Module({
    imports: [
        TypeOrmModule.forFeature([CommentEntity]),
        PostModule,
        UserModule,
    ],
    providers: [CommentService],
    exports: [CommentService],
})
export class CommentModule {}
