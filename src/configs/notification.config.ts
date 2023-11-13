import { registerAs } from '@nestjs/config';

export default registerAs(
    'notification',
    (): Record<string, any> => ({
        fcm: {
            projectId: process.env.FCM_PROJECT_ID,
            privateKey: process.env.FCM_PRIVATE_KEY.replace(/\\n/gm, '\n'),
            clientEmail: process.env.FCM_CLIENT_EMAIL,
        },
    })
);
