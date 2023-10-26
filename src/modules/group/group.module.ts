import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupService } from './services/group.service';
import { GroupEntity } from './entities/group.entity';
import { GroupMembershipEntity } from './entities/group-membership.entity';
import { UserModule } from '../user/user.module';
@Module({
    imports: [
        TypeOrmModule.forFeature([GroupEntity, GroupMembershipEntity]),
        UserModule,
    ],
    providers: [GroupService],
    exports: [GroupService],
})
export class GroupModule {}
