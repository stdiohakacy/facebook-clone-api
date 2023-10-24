import { Module } from '@nestjs/common';
import { AuthCoreModule } from 'src/core/auth/auth.core.module';
import { AwsModule } from 'src/core/aws/aws.module';
import { UserAuthController } from 'src/modules/user/controllers/user.auth.controller';
import { UserModule } from 'src/modules/user/user.module';

@Module({
    controllers: [UserAuthController],
    providers: [],
    exports: [],
    imports: [AuthCoreModule, AwsModule, UserModule],
})
export class RoutesAuthModule {}
