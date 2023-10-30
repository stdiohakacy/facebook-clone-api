import { Socket } from 'socket.io';
import { UserEntity } from '../user/entities/user.entity';

export interface SocketAuthenticate extends Socket {
    user: UserEntity;
}
