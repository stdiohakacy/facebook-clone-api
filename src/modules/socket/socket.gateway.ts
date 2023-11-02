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
import {
    ENUM_EMIT_MESSAGE_KEY,
    ENUM_SUBSCRIBE_MESSAGE_KEY,
} from './constants/enum.socket.constant';
import { OnEvent } from '@nestjs/event-emitter';
import { ENUM_MESSAGE_EVENT_KEY } from '../message/constants/message.enum.constant';
import { GroupService } from '../group/services/group.service';

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
        private readonly groupService: GroupService
    ) {}

    @WebSocketServer()
    server: Server;

    handleConnection(socket: SocketAuthenticate) {
        this.socketSessionManager.setUserSocket(socket.user.id, socket);
    }

    handleDisconnect(socket: SocketAuthenticate) {
        this.socketSessionManager.removeUserSocket(socket.user.id);
    }

    @SubscribeMessage(ENUM_SUBSCRIBE_MESSAGE_KEY.GROUP_JOIN)
    onGroupJoin(
        @MessageBody() groupKey: string,
        @ConnectedSocket() client: SocketAuthenticate
    ) {
        client.join(groupKey);
        client
            .to(groupKey)
            .emit(ENUM_EMIT_MESSAGE_KEY.GROUP_USER_JOIN_RECEIVED);
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
        socket.to(conversationKey).emit('userJoin');
    }

    @SubscribeMessage(ENUM_SUBSCRIBE_MESSAGE_KEY.CONVERSATION_LEAVE)
    onConversationLeave(
        @MessageBody() conversationKey: string,
        @ConnectedSocket() client: SocketAuthenticate
    ) {
        client.leave(conversationKey);
        client.to(conversationKey).emit('userLeave');
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

    @SubscribeMessage(ENUM_SUBSCRIBE_MESSAGE_KEY.GROUP_GET_ONLINE_USERS)
    async handleGetOnlineGroupUsers(
        @MessageBody() groupId: string,
        @ConnectedSocket() socket: SocketAuthenticate
    ) {
        const onlineUsers = [];
        const offlineUsers = [];

        const users = await this.groupService.getOnlineGroupUsers(groupId);
        if (!users.length) return;

        users.forEach((user) => {
            const socket = this.socketSessionManager.getUserSocket(user.id);
            socket ? onlineUsers.push(user) : offlineUsers.push(user);
        });

        socket.emit(ENUM_EMIT_MESSAGE_KEY.GROUP_USERS_ONLINE_RECEIVED, {
            onlineUsers,
            offlineUsers,
        });
    }

    @SubscribeMessage(ENUM_SUBSCRIBE_MESSAGE_KEY.GROUP_LEAVE)
    onGroupLeave(
        @MessageBody() groupKey: string,
        @ConnectedSocket() client: SocketAuthenticate
    ) {
        client.leave(groupKey);
        client
            .to(groupKey)
            .emit(ENUM_EMIT_MESSAGE_KEY.GROUP_USER_LEAVE_RECEIVED);
    }

    @SubscribeMessage(ENUM_SUBSCRIBE_MESSAGE_KEY.TYPING_START)
    onTypingStart(
        @MessageBody() conversationKey: string,
        @ConnectedSocket() client: SocketAuthenticate
    ) {
        client.to(conversationKey).emit(ENUM_EMIT_MESSAGE_KEY.TYPING_START);
    }

    @SubscribeMessage(ENUM_SUBSCRIBE_MESSAGE_KEY.TYPING_STOP)
    onTypingStop(
        @MessageBody() conversationKey: string,
        @ConnectedSocket() client: SocketAuthenticate
    ) {
        client.to(conversationKey).emit(ENUM_EMIT_MESSAGE_KEY.TYPING_STOP);
    }

    @OnEvent(ENUM_MESSAGE_EVENT_KEY.CONVERSATION_CREATE)
    handleConversationCreateEvent(payload: any) {
        const recipientSocket = this.socketSessionManager.getUserSocket(
            payload.receiverId
        );
        if (recipientSocket)
            recipientSocket.emit(
                ENUM_EMIT_MESSAGE_KEY.CONVERSATION_CREATE_RECEIVED,
                payload
            );
    }

    // @OnEvent(ENUM_MESSAGE_EVENT_KEY.MESSAGE_DELETE)
    // async handleMessageDelete(payload) {
    // const conversation = await this.conversationService.findById(
    //     payload.conversationId
    // );
    // if (!conversation) return;
    // const { creator, recipient } = conversation;
    // const recipientSocket =
    //     creator.id === payload.userId
    //         ? this.sessions.getUserSocket(recipient.id)
    //         : this.sessions.getUserSocket(creator.id);
    // if (recipientSocket) recipientSocket.emit('onMessageDelete', payload);
    // }

    // @OnEvent(ENUM_MESSAGE_EVENT_KEY.MESSAGE_UPDATE)
    // async handleMessageUpdate(message: any) {
    // const {
    //     author,x
    //     conversation: { creator, recipient },
    // } = message;
    // console.log(message);
    // const recipientSocket =
    //     author.id === creator.id
    //         ? this.sessions.getUserSocket(recipient.id)
    //         : this.sessions.getUserSocket(creator.id);
    // if (recipientSocket) recipientSocket.emit('onMessageUpdate', message);
    // }

    // @OnEvent('group.message.create')
    // async handleGroupMessageCreate(payload: CreateGroupMessageResponse) {
    //     const { id } = payload.group;
    //     console.log('Inside group.message.create');
    //     this.server.to(`group-${id}`).emit('onGroupMessage', payload);
    // }

    // @OnEvent('group.create')
    // handleGroupCreate(payload: Group) {
    //     console.log('group.create event');
    //     payload.users.forEach((user) => {
    //         const socket = this.sessions.getUserSocket(user.id);
    //         socket && socket.emit('onGroupCreate', payload);
    //     });
    // }

    // @OnEvent('group.message.update')
    // handleGroupMessageUpdate(payload: GroupMessage) {
    //     const room = `group-${payload.group.id}`;
    //     console.log(room);
    //     this.server.to(room).emit('onGroupMessageUpdate', payload);
    // }

    // @OnEvent('group.user.add')
    // handleGroupUserAdd(payload: AddGroupUserResponse) {
    //     const recipientSocket = this.sessions.getUserSocket(payload.user.id);
    //     console.log('inside group.user.add');
    //     console.log(`group-${payload.group.id}`);
    //     this.server
    //         .to(`group-${payload.group.id}`)
    //         .emit('onGroupReceivedNewUser', payload);
    //     recipientSocket && recipientSocket.emit('onGroupUserAdd', payload);
    // }

    // @OnEvent('group.user.remove')
    // handleGroupUserRemove(payload: RemoveGroupUserResponse) {
    //     const { group, user } = payload;
    //     const ROOM_NAME = `group-${payload.group.id}`;
    //     const removedUserSocket = this.sessions.getUserSocket(payload.user.id);
    //     console.log(payload);
    //     console.log('Inside group.user.remove');
    //     if (removedUserSocket) {
    //         console.log('Emitting onGroupRemoved');
    //         removedUserSocket.emit('onGroupRemoved', payload);
    //         removedUserSocket.leave(ROOM_NAME);
    //     }
    //     this.server.to(ROOM_NAME).emit('onGroupRecipientRemoved', payload);
    //     const onlineUsers = group.users
    //         .map((user) => this.sessions.getUserSocket(user.id) && user)
    //         .filter((user) => user);
    //     // this.server.to(ROOM_NAME).emit('onlineGroupUsersReceived', { onlineUsers });
    // }

    // @OnEvent('group.owner.update')
    // handleGroupOwnerUpdate(payload: Group) {
    //     const ROOM_NAME = `group-${payload.id}`;
    //     const newOwnerSocket = this.sessions.getUserSocket(payload.owner.id);
    //     console.log('Inside group.owner.update');
    //     const { rooms } = this.server.sockets.adapter;
    //     console.log(rooms.get(ROOM_NAME));
    //     const socketsInRoom = rooms.get(ROOM_NAME);
    //     console.log('Sockets In Room');
    //     console.log(socketsInRoom);
    //     console.log(newOwnerSocket);
    //     // Check if the new owner is in the group (room)
    //     this.server.to(ROOM_NAME).emit('onGroupOwnerUpdate', payload);
    //     if (newOwnerSocket && !socketsInRoom.has(newOwnerSocket.id)) {
    //         console.log('The new owner is not in the room...');
    //         newOwnerSocket.emit('onGroupOwnerUpdate', payload);
    //     }
    // }

    // @OnEvent('group.user.leave')
    // handleGroupUserLeave(payload) {
    //     console.log('inside group.user.leave');
    //     const ROOM_NAME = `group-${payload.group.id}`;
    //     const { rooms } = this.server.sockets.adapter;
    //     const socketsInRoom = rooms.get(ROOM_NAME);
    //     const leftUserSocket = this.sessions.getUserSocket(payload.userId);
    //     /**
    //      * If socketsInRoom is undefined, this means that there is
    //      * no one connected to the room. So just emit the event for
    //      * the connected user if they are online.
    //      */
    //     console.log(socketsInRoom);
    //     console.log(leftUserSocket);
    //     if (leftUserSocket && socketsInRoom) {
    //         console.log('user is online, at least 1 person is in the room');
    //         if (socketsInRoom.has(leftUserSocket.id)) {
    //             console.log('User is in room... room set has socket id');
    //             return this.server
    //                 .to(ROOM_NAME)
    //                 .emit('onGroupParticipantLeft', payload);
    //         } else {
    //             console.log('User is not in room, but someone is there');
    //             leftUserSocket.emit('onGroupParticipantLeft', payload);
    //             this.server
    //                 .to(ROOM_NAME)
    //                 .emit('onGroupParticipantLeft', payload);
    //             return;
    //         }
    //     }
    //     if (leftUserSocket && !socketsInRoom) {
    //         console.log('User is online but there are no sockets in the room');
    //         return leftUserSocket.emit('onGroupParticipantLeft', payload);
    //     }
    // }

    // @SubscribeMessage('getOnlineFriends')
    // async handleFriendListRetrieve(
    //     @MessageBody() data: any,
    //     @ConnectedSocket() socket: AuthenticatedSocket
    // ) {
    //     const { user } = socket;
    //     if (user) {
    //         console.log('user is authenticated');
    //         console.log(`fetching ${user.username}'s friends`);
    //         const friends = await this.friendsService.getFriends(user.id);
    //         const onlineFriends = friends.filter((friend) =>
    //             this.sessions.getUserSocket(
    //                 user.id === friend.receiver.id
    //                     ? friend.sender.id
    //                     : friend.receiver.id
    //             )
    //         );
    //         socket.emit('getOnlineFriends', onlineFriends);
    //     }
    // }

    // @SubscribeMessage('onVideoCallInitiate')
    // async handleVideoCall(
    //     @MessageBody() data: CreateCallDto,
    //     @ConnectedSocket() socket: AuthenticatedSocket
    // ) {
    //     console.log('onVideoCallInitiate');
    //     const caller = socket.user;
    //     const receiverSocket = this.sessions.getUserSocket(data.recipientId);
    //     if (!receiverSocket) socket.emit('onUserUnavailable');
    //     receiverSocket.emit('onVideoCall', { ...data, caller });
    // }

    // @SubscribeMessage('videoCallAccepted')
    // async handleVideoCallAccepted(
    //     @MessageBody() data: CallAcceptedPayload,
    //     @ConnectedSocket() socket: AuthenticatedSocket
    // ) {
    //     const callerSocket = this.sessions.getUserSocket(data.caller.id);
    //     const conversation = await this.conversationService.isCreated(
    //         data.caller.id,
    //         socket.user.id
    //     );
    //     if (!conversation) return console.log('No conversation found');
    //     if (callerSocket) {
    //         console.log('Emitting onVideoCallAccept event');
    //         const payload = { ...data, conversation, acceptor: socket.user };
    //         callerSocket.emit('onVideoCallAccept', payload);
    //         socket.emit('onVideoCallAccept', payload);
    //     }
    // }

    // @SubscribeMessage(WebsocketEvents.VIDEO_CALL_REJECTED)
    // async handleVideoCallRejected(
    //     @MessageBody() data,
    //     @ConnectedSocket() socket: AuthenticatedSocket
    // ) {
    //     console.log('inside videoCallRejected event');
    //     const receiver = socket.user;
    //     const callerSocket = this.sessions.getUserSocket(data.caller.id);
    //     callerSocket &&
    //         callerSocket.emit(WebsocketEvents.VIDEO_CALL_REJECTED, {
    //             receiver,
    //         });
    //     socket.emit(WebsocketEvents.VIDEO_CALL_REJECTED, { receiver });
    // }

    // @SubscribeMessage('videoCallHangUp')
    // async handleVideoCallHangUp(
    //     @MessageBody() { caller, receiver }: CallHangUpPayload,
    //     @ConnectedSocket() socket: AuthenticatedSocket
    // ) {
    //     console.log('inside videoCallHangup event');
    //     if (socket.user.id === caller.id) {
    //         const receiverSocket = this.sessions.getUserSocket(receiver.id);
    //         socket.emit('onVideoCallHangUp');
    //         return receiverSocket && receiverSocket.emit('onVideoCallHangUp');
    //     }
    //     socket.emit('onVideoCallHangUp');
    //     const callerSocket = this.sessions.getUserSocket(caller.id);
    //     callerSocket && callerSocket.emit('onVideoCallHangUp');
    // }

    // @SubscribeMessage('onVoiceCallInitiate')
    // async handleVoiceCallInitiate(
    //     @MessageBody() payload: VoiceCallPayload,
    //     @ConnectedSocket() socket: AuthenticatedSocket
    // ) {
    //     const caller = socket.user;
    //     const receiverSocket = this.sessions.getUserSocket(payload.recipientId);
    //     if (!receiverSocket) socket.emit('onUserUnavailable');
    //     receiverSocket.emit('onVoiceCall', { ...payload, caller });
    // }

    // @SubscribeMessage(WebsocketEvents.VOICE_CALL_ACCEPTED)
    // async handleVoiceCallAccepted(
    //     @MessageBody() payload: CallAcceptedPayload,
    //     @ConnectedSocket() socket: AuthenticatedSocket
    // ) {
    //     console.log('Inside onVoiceCallAccepted event');
    //     const callerSocket = this.sessions.getUserSocket(payload.caller.id);
    //     const conversation = await this.conversationService.isCreated(
    //         payload.caller.id,
    //         socket.user.id
    //     );
    //     if (!conversation) return console.log('No conversation found');
    //     if (callerSocket) {
    //         console.log('Emitting onVoiceCallAccepted event');
    //         const callPayload = {
    //             ...payload,
    //             conversation,
    //             acceptor: socket.user,
    //         };
    //         callerSocket.emit(WebsocketEvents.VOICE_CALL_ACCEPTED, callPayload);
    //         socket.emit(WebsocketEvents.VOICE_CALL_ACCEPTED, callPayload);
    //     }
    // }

    // @SubscribeMessage(WebsocketEvents.VOICE_CALL_HANG_UP)
    // async handleVoiceCallHangUp(
    //     @MessageBody() { caller, receiver }: CallHangUpPayload,
    //     @ConnectedSocket() socket: AuthenticatedSocket
    // ) {
    //     console.log('inside onVoiceCallHangUp event');
    //     if (socket.user.id === caller.id) {
    //         const receiverSocket = this.sessions.getUserSocket(receiver.id);
    //         socket.emit(WebsocketEvents.VOICE_CALL_HANG_UP);
    //         return (
    //             receiverSocket &&
    //             receiverSocket.emit(WebsocketEvents.VOICE_CALL_HANG_UP)
    //         );
    //     }
    //     socket.emit(WebsocketEvents.VOICE_CALL_HANG_UP);
    //     const callerSocket = this.sessions.getUserSocket(caller.id);
    //     callerSocket && callerSocket.emit(WebsocketEvents.VOICE_CALL_HANG_UP);
    // }

    // @SubscribeMessage(WebsocketEvents.VOICE_CALL_REJECTED)
    // async handleVoiceCallRejected(
    //     @MessageBody() data,
    //     @ConnectedSocket() socket: AuthenticatedSocket
    // ) {
    //     console.log('inside onVoiceCallRejected event');
    //     const receiver = socket.user;
    //     const callerSocket = this.sessions.getUserSocket(data.caller.id);
    //     callerSocket &&
    //         callerSocket.emit(WebsocketEvents.VOICE_CALL_REJECTED, {
    //             receiver,
    //         });
    //     socket.emit(WebsocketEvents.VOICE_CALL_REJECTED, { receiver });
    // }
}
