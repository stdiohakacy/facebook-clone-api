import { Module } from '@nestjs/common';
import { SocketGateway } from './socket.gateway';
import { SocketGatewaySessionManager } from './socket.gateway.session-manager';

@Module({
    imports: [],
    providers: [SocketGateway, SocketGatewaySessionManager],
    exports: [SocketGateway],
})
export class SocketCoreModule {}
