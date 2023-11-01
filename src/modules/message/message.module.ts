import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../user/user.module';
import { MessageEntity } from './entities/message.entity';
import { MessageService } from './services/message.service';
@Module({
    imports: [TypeOrmModule.forFeature([MessageEntity]), UserModule],
    providers: [MessageService],
    exports: [MessageService],
})
export class MessageModule {}
