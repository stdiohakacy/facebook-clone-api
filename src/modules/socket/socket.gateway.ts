import {
    WebSocketGateway,
    WebSocketServer,
    OnGatewayConnection,
    OnGatewayDisconnect,
    SubscribeMessage,
    MessageBody,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { SocketAuthenticate } from './socket.authenticated';
import { SocketGatewaySessionManager } from './socket.gateway.session-manager';
import { MESSAGE_ENUM_EVENT_TYPE } from './constants/message.event.enum';

@WebSocketGateway({
    cors: {
        origin: ['http://localhost:3000'],
        credentials: true,
    },
    pingInterval: 10000,
    pingTimeout: 15000,
})
export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
    constructor(
        private readonly socketSessionManager: SocketGatewaySessionManager
    ) {}

    @WebSocketServer()
    server: Server;

    handleConnection(socket: SocketAuthenticate) {
        this.socketSessionManager.setUserSocket(socket.user.id, socket);
    }

    handleDisconnect(socket: SocketAuthenticate) {
        this.socketSessionManager.removeUserSocket(socket.user.id);
    }

    @SubscribeMessage(MESSAGE_ENUM_EVENT_TYPE.MESSAGE_CREATE)
    handleMessageCreate(@MessageBody() data: any) {
        console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@');
        console.log(data);
        console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@');
    }
}
