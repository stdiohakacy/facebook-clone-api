import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import firebase from 'firebase-admin';

@Injectable()
export class NotificationService {
    constructor(private readonly configService: ConfigService) {
        // if (!firebase.app.length) {

        // }

        firebase.initializeApp({
            credential: firebase.credential.cert({
                projectId: this.configService.get<string>(
                    'notification.fcm.projectId'
                ),
                privateKey: String(
                    this.configService.get<string>(
                        'notification.fcm.privateKey'
                    )
                ),
                clientEmail: this.configService.get<string>(
                    'notification.fcm.clientEmail'
                ),
            }),
        });
    }

    async send(token: string, title: string, body: string) {
        await firebase
            .messaging()
            .send({ notification: { title, body }, token })
            .catch((error: any) => console.error(`Error!!!!!`, error));
    }

    // async acceptPushNotification(_user: UserEntity, _dto: any) {}
    // async disablePushNotification(_user: UserEntity, _dto: any) {}
}
