import { Injectable } from '@nestjs/common';
import { SocketAuthenticate } from './socket.authenticated';

export interface ISocketGatewaySessionManager {
    getUserSocket(id: string): SocketAuthenticate;
    setUserSocket(id: string, socket: SocketAuthenticate): void;
    removeUserSocket(id: string): void;
    getSockets(): Map<string, SocketAuthenticate>;
}

@Injectable()
export class SocketGatewaySessionManager
    implements ISocketGatewaySessionManager
{
    private readonly sessions: Map<string, SocketAuthenticate> = new Map();

    getUserSocket(id: string): SocketAuthenticate {
        return this.sessions.get(id);
    }

    setUserSocket(userId: string, socket: SocketAuthenticate): void {
        this.sessions.set(userId, socket);
    }

    removeUserSocket(userId: string): void {
        this.sessions.delete(userId);
    }

    getSockets(): Map<string, SocketAuthenticate> {
        return this.sessions;
    }
}
