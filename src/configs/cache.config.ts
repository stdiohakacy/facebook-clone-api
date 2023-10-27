import { registerAs } from '@nestjs/config';

export default registerAs(
    'cache',
    (): Record<string, any> => ({
        redis: {
            host: process.env.REDIS_HOST || 'localhost',
            port: Number(process.env.REDIS_PORT) || 6379,
            portUI: Number(process.env.REDIS_PORT_UI) || 8081,
            password: process.env.REDIS_PASSWORD || 'password',
        },
    })
);
