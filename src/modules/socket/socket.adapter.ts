import { IoAdapter } from '@nestjs/platform-socket.io';
import { NestApplication } from '@nestjs/core';
import { SocketAuthenticate } from './socket.authenticated';
import { WsException } from '@nestjs/websockets';
import { AuthService } from 'src/core/auth/services/auth.service';
import { ForbiddenException } from '@nestjs/common';
import { UserService } from '../user/services/user.service';

export class WebsocketAdapter extends IoAdapter {
    private readonly app: NestApplication = null;

    constructor(app: NestApplication) {
        super(app);
        this.app = app;
    }

    createIOServer(port: number, options?: any) {
        const authService = this.app.get(AuthService);
        const userService = this.app.get(UserService);

        const server = super.createIOServer(port, options);
        server.use(async (socket: SocketAuthenticate, next) => {
            const token = socket.handshake.query.token as string;

            if (!token) {
                return next(new WsException('Forbidden! No jwt provided!'));
            }

            const payload = await authService.payloadAccessToken(token);

            if (!payload) {
                return next(new ForbiddenException('Jwt invalid!'));
            }

            const user = await userService.getById(payload?.data?.id);
            socket.user = user;
            next();
        });

        return server;
    }
}
