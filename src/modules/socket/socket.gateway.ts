import {
    WebSocketGateway,
    WebSocketServer,
    OnGatewayConnection,
    OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { SocketAuthenticate } from './socket.authenticated';

@WebSocketGateway({
    cors: {
        origin: ['http://localhost:3000'],
        credentials: true,
    },
    pingInterval: 10000,
    pingTimeout: 15000,
})
export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
    constructor() {}

    @WebSocketServer()
    server: Server;

    handleConnection(socket: SocketAuthenticate) {
        console.log('handleConnection', socket.user);
    }

    handleDisconnect(client: SocketAuthenticate) {
        console.log(`handleDisconnect ${client.id}`);
    }
}
