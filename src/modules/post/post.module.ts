import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostEntity } from './entities/post.entity';
import { PostService } from './services/post.service';
import { UserModule } from '../user/user.module';
@Module({
    imports: [TypeOrmModule.forFeature([PostEntity]), UserModule],
    providers: [PostService],
    exports: [PostService],
})
export class PostModule {}
