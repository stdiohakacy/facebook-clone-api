import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupService } from './services/group.service';
import { GroupEntity } from './entities/group.entity';
@Module({
    imports: [TypeOrmModule.forFeature([GroupEntity])],
    providers: [GroupService],
    exports: [GroupService],
})
export class GroupModule {}
