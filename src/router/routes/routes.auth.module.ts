import { Module } from '@nestjs/common';
import { AuthCoreModule } from '../../core/auth/auth.core.module';
import { AwsModule } from '../../core/aws/aws.module';
import { FriendshipAuthController } from '../../modules/friendship/controllers/friendship.auth.controller';
import { FriendshipModule } from '../../modules/friendship/friendship.module';
import { UserAuthController } from '../../modules/user/controllers/user.auth.controller';
import { UserModule } from '../../modules/user/user.module';
import { PostModule } from 'src/modules/post/post.module';
import { PostAuthController } from 'src/modules/post/controllers/post.auth.controller';
import { CommentModule } from 'src/modules/comment/comment.module';
import { CommentAuthController } from 'src/modules/comment/controllers/comment.auth.controller';
import { NotificationModule } from 'src/modules/notifications/notification.module';
import { NotificationAuthController } from 'src/modules/notifications/controllers/notification.auth.controller';
import { GroupModule } from 'src/modules/group/group.module';
import { GroupAuthController } from 'src/modules/group/controllers/group.auth.controller';

@Module({
    imports: [
        AuthCoreModule,
        AwsModule,
        UserModule,
        FriendshipModule,
        PostModule,
        CommentModule,
        NotificationModule,
        GroupModule,
    ],
    controllers: [
        UserAuthController,
        FriendshipAuthController,
        PostAuthController,
        CommentAuthController,
        NotificationAuthController,
        GroupAuthController,
    ],
    providers: [],
    exports: [],
})
export class RoutesAuthModule {}
