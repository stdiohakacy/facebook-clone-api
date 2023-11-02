import {
    WebSocketGateway,
    WebSocketServer,
    OnGatewayConnection,
    OnGatewayDisconnect,
    SubscribeMessage,
    MessageBody,
    ConnectedSocket,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { SocketAuthenticate } from './socket.authenticated';
import { SocketGatewaySessionManager } from './socket.gateway.session-manager';
import { ENUM_SUBSCRIBE_MESSAGE_KEY } from './constants/enum.socket.constant';
import { MessageService } from '../message/services/message.service';
import { OnEvent } from '@nestjs/event-emitter';
import { ENUM_MESSAGE_EVENT_KEY } from '../message/constants/message.enum.constant';

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
        private readonly socketSessionManager: SocketGatewaySessionManager,
        private readonly messageService: MessageService
    ) {}

    @WebSocketServer()
    server: Server;

    handleConnection(socket: SocketAuthenticate) {
        this.socketSessionManager.setUserSocket(socket.user.id, socket);
    }

    handleDisconnect(socket: SocketAuthenticate) {
        this.socketSessionManager.removeUserSocket(socket.user.id);
    }

    @SubscribeMessage(ENUM_SUBSCRIBE_MESSAGE_KEY.CONVERSATION_JOIN)
    onConversationJoin(
        @MessageBody() conversationKey: string,
        @ConnectedSocket() socket: SocketAuthenticate
    ) {
        console.log(
            `${socket?.user?.id} joined a Conversation of key: ${conversationKey}`
        );
        socket.join(conversationKey);
        console.log(socket.rooms);
        // socket.to(`conversationKey`).emit('userJoin');
    }

    @OnEvent(ENUM_MESSAGE_EVENT_KEY.MESSAGE_CREATE)
    handleMessageCreateEvent(payload: any) {
        const { senderId, receiverId } = payload;
        const senderSocket = this.socketSessionManager.getUserSocket(senderId);
        const receiverSocket =
            this.socketSessionManager.getUserSocket(receiverId);
        if (senderSocket) {
            senderSocket.emit(ENUM_MESSAGE_EVENT_KEY.MESSAGE_CREATED, payload);
        }
        if (receiverSocket) {
            receiverSocket.emit(
                ENUM_MESSAGE_EVENT_KEY.MESSAGE_CREATED,
                payload
            );
        }
    }
}
