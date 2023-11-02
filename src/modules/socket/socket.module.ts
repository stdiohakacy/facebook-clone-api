import { Module } from '@nestjs/common';
import { SocketGateway } from './socket.gateway';
import { SocketGatewaySessionManager } from './socket.gateway.session-manager';
import { MessageModule } from '../message/message.module';
import { GroupModule } from '../group/group.module';

@Module({
    imports: [MessageModule, GroupModule],
    providers: [SocketGateway, SocketGatewaySessionManager],
    exports: [SocketGateway],
})
export class SocketCoreModule {}
