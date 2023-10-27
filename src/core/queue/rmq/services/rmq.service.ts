import EventEmitter from 'events';
import { Injectable } from '@nestjs/common';
import {
    connect,
    AmqpConnectionManager,
    ChannelWrapper,
} from 'amqp-connection-manager';
import { Channel, Message, Connection, ConfirmChannel } from 'amqplib';
import { v4 } from 'uuid';
import {
    CONNECT_EVENT,
    DISCONNECT_EVENT,
    ERROR_EVENT,
    RMQ_REPLY_QUEUE,
    TRMQResponse,
} from '../constants/rmq.constant';
import { IRMQConnection, IRMQHandler } from '../interfaces/rmq.interface';
import { RmqExplorer } from '../explorers/rmq.explorer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RmqService {
    protected server: AmqpConnectionManager;
    protected connection: Connection;
    protected clientChannel: ChannelWrapper;
    protected subscriptionChannel: ChannelWrapper;
    protected sendResponseEmitter: EventEmitter = new EventEmitter();

    private readonly rmqName: string;
    private readonly rmqType: string;
    private readonly rmqUsername: string;
    private readonly rmqPassword: string;
    private readonly rmqHost: string;
    private readonly rmqPort: string;
    private readonly rmqVHost: string;
    private readonly rmqReconnectTimeInSeconds: number;
    private readonly rmqHeartbeatIntervalInSeconds: number;
    private readonly rmqPrefetchCount: number;
    private readonly rmqIsGlobalPrefetchCount: string;

    constructor(
        private readonly rmqExplorerService: RmqExplorer,
        private readonly configService: ConfigService
    ) {
        this.rmqName = this.configService.get<string>('queue.rmq.name');
        this.rmqType = this.configService.get<string>('queue.rmq.type');
        this.rmqUsername = this.configService.get<string>('queue.rmq.username');
        this.rmqPassword = this.configService.get<string>('queue.rmq.password');
        this.rmqHost = this.configService.get<string>('queue.rmq.host');
        this.rmqPort = this.configService.get<string>('queue.rmq.port');
        this.rmqVHost = this.configService.get<string>('queue.rmq.vhost');
        this.rmqReconnectTimeInSeconds = this.configService.get<number>(
            'queue.rmq.rmqReconnectTimeInSeconds'
        );
        this.rmqPrefetchCount = this.configService.get<number>(
            'queue.rmq.prefetchCount'
        );
        this.rmqIsGlobalPrefetchCount = this.configService.get<string>(
            'queue.rmq.isGlobalPrefetchCount'
        );

        const connectionUri = this.createConnectionUri({
            login: this.rmqUsername,
            password: this.rmqPassword,
            host: this.rmqHost,
            port: this.rmqPort,
            // vhost: this.rmqVHost,
        });

        const connectionOptions = {
            reconnectTimeInSeconds: this.rmqReconnectTimeInSeconds ?? 5,
            heartbeatIntervalInSeconds: this.rmqHeartbeatIntervalInSeconds ?? 5,
        };

        this.server = connect([connectionUri], connectionOptions);

        this.server.on(CONNECT_EVENT, (connection: Connection) => {
            this.connection = connection;
            console.info('RMQModule connected');
        });

        this.server.addListener(ERROR_EVENT, (err: unknown) => {
            console.error(err);
        });

        this.server.addListener(DISCONNECT_EVENT, (err: any) => {
            console.error(err);
            this.close();
        });

        this.initializedDependencies().then();
    }

    public async send<T>(routingKey: string, message: T) {
        await this.clientChannel.publish(
            this.rmqName,
            routingKey,
            Buffer.from(JSON.stringify(message)),
            {
                replyTo: RMQ_REPLY_QUEUE,
                timestamp: new Date().getTime(),
                correlationId: v4(),
            }
        );
    }

    public async createQueue(handler: IRMQHandler) {
        await this.subscriptionChannel.addSetup(
            async (channel: ConfirmChannel) => {
                const { queue } = await channel.assertQueue(handler.meta.queue);

                await channel.bindQueue(
                    queue,
                    handler.meta.exchange,
                    handler.meta.routingKey
                );

                console.info(`bindQueue - ${handler.meta.routingKey}`);

                await channel.consume(queue, async (msg) => {
                    console.info(`consume - ${handler.meta.routingKey}`);

                    const msg_content = msg.content.toString();

                    const response: TRMQResponse =
                        await handler.discoveredMethod.parentClass[
                            handler.discoveredMethod.methodName
                        ](JSON.parse(msg_content));

                    if (response === 'nack') {
                        channel.nack(msg, false, false);
                    } else {
                        channel.ack(msg, false);
                    }
                });
            }
        );
    }

    private async initializedDependencies() {
        await Promise.all([
            this.createSubscriptionChannel(),
            this.createClientChannel(),
        ]);

        const handlers = this.rmqExplorerService.handlers;

        for (const handler of handlers) {
            await this.createQueue(handler);
        }

        console.info('RMQModule dependencies initialized');
    }

    private async createClientChannel() {
        this.clientChannel = this.server.createChannel({
            json: false,
            setup: async (channel: Channel) => {
                await channel.consume(
                    RMQ_REPLY_QUEUE,
                    (msg: Message) => {
                        this.sendResponseEmitter.emit(
                            msg.properties.correlationId,
                            msg
                        );
                    },
                    { noAck: true }
                );
            },
        });
    }

    private async createSubscriptionChannel() {
        this.subscriptionChannel = this.server.createChannel({
            json: false,
            setup: async (channel: Channel) => {
                await channel.assertExchange(this.rmqName, this.rmqType, {
                    durable: true,
                    // arguments?: this.options.exchange.arguments,
                });

                await channel.prefetch(
                    this.rmqPrefetchCount ?? 0,
                    false
                    // this.rmqIsGlobalPrefetchCount ??
                );
            },
        });
    }

    private createConnectionUri(connection: IRMQConnection): string {
        let uri = `amqp://${connection.login}:${connection.password}@${connection.host}`;

        if (connection.port) {
            uri += `:${connection.port}`;
        }

        if (connection.vhost) {
            uri += `/${connection.vhost}`;
        }

        return uri;
    }

    private close(): void {
        if (this.subscriptionChannel) {
            this.subscriptionChannel.close();
        }
        if (this.clientChannel) {
            this.clientChannel.close();
        }
        if (this.server) {
            this.server.close();
        }
        this.sendResponseEmitter.removeAllListeners();
        this.server = null;
        this.subscriptionChannel = null;
        this.clientChannel = null;
        this.connection = null;
    }
}
