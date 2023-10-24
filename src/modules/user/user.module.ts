import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { AuthCoreModule } from 'src/core/auth/auth.core.module';
import { UserService } from './services/user.service';
import { EmailModule } from '../email/email.module';
import { StorageModule } from '../storages/storage.module';
@Module({
    imports: [
        TypeOrmModule.forFeature([UserEntity]),
        AuthCoreModule,
        EmailModule,
        StorageModule,
    ],
    providers: [UserService],
    controllers: [],
    exports: [UserService],
})
export class UserModule {}
