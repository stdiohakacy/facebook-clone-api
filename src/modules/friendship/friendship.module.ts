import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FriendshipEntity } from './entities/friendship.entity';
import { FriendshipService } from './services/friendship.service';
import { UserModule } from '../user/user.module';
@Module({
    imports: [TypeOrmModule.forFeature([FriendshipEntity]), UserModule],
    providers: [FriendshipService],
    exports: [FriendshipService],
})
export class FriendshipModule {}
