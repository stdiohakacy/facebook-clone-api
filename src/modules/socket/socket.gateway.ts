import {
    WebSocketGateway,
    WebSocketServer,
    OnGatewayConnection,
    OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

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

    handleConnection(socket: Socket) {
        console.log('handleConnection');
        socket.emit('connected', {});
    }

    handleDisconnect(client: Socket) {
        console.log(`handleDisconnect ${client.id}`);
    }
}
