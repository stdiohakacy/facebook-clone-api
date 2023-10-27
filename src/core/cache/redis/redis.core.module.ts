import { DynamicModule, Module, Provider } from '@nestjs/common';
import { RedisService } from './services/redis.service';
import { ConfigService } from '@nestjs/config';
import IORedis, { Redis } from 'ioredis';
import {
    REDIS_PUBLISHER_CLIENT,
    REDIS_SUBSCRIBER_CLIENT,
} from './constants/redis.constant';

@Module({
    providers: [RedisService],
    exports: [RedisService],
})
export class RedisCoreModule {
    static forRoot(): DynamicModule {
        const providers: Provider[] = [
            {
                useFactory: (configService: ConfigService): Redis => {
                    const host = configService.get<string>('cache.redis.host');
                    const port = configService.get<number>('cache.redis.port');
                    const password = configService.get<string>(
                        'cache.redis.password'
                    );

                    return new IORedis({
                        host: host,
                        port: port,
                        password: password,
                    });
                },
                inject: [ConfigService],
                provide: REDIS_SUBSCRIBER_CLIENT,
            },
            {
                useFactory: (configService: ConfigService): Redis => {
                    const host = configService.get<string>('cache.redis.host');
                    const port = configService.get<number>('cache.redis.port');
                    const password = configService.get<string>(
                        'cache.redis.password'
                    );

                    return new IORedis({
                        host: host,
                        port: port,
                        password: password,
                    });
                },
                inject: [ConfigService],
                provide: REDIS_PUBLISHER_CLIENT,
            },
        ];

        return {
            module: RedisCoreModule,
            providers,
        };
    }
}
