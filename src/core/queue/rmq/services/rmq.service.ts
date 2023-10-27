import EventEmitter from 'events';

import { Inject, Injectable, OnModuleInit } from '@nestjs/common';

import {
    connect,
    AmqpConnectionManager,
    ChannelWrapper,
} from 'amqp-connection-manager';
import { Channel, Message, Connection, ConfirmChannel } from 'amqplib';
import { v4 } from 'uuid';

import {
    RMQ_MODULE_OPTIONS,
    RMQ_REPLY_QUEUE,
    ERROR_EVENT,
    DISCONNECT_EVENT,
    CONNECT_EVENT,
    IRMQHandler,
    TRMQResponse,
} from '../constants/rmq.constants';
import { RmqExplorer } from '../explorers/rmq.explorer';
import { IRMQConnection, IRMQModuleOptions } from '../interfaces/rmq.interface';

@Injectable()
export class RmqService implements OnModuleInit {
    protected server: AmqpConnectionManager;
    protected connection: Connection;
    protected clientChannel: ChannelWrapper;
    protected subscriptionChannel: ChannelWrapper;
    protected sendResponseEmitter: EventEmitter = new EventEmitter();

    constructor(
        @Inject(RMQ_MODULE_OPTIONS) private readonly options: IRMQModuleOptions,
        private readonly rmqExplorerService: RmqExplorer
    ) {}

    async onModuleInit() {
        const connectionUri = this.createConnectionUri(this.options.connection);

        const connectionOptions = {
            reconnectTimeInSeconds: this.options.reconnectTimeInSeconds ?? 5,
            heartbeatIntervalInSeconds:
                this.options.heartbeatIntervalInSeconds ?? 5,
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

    private async createSubscriptionChannel() {
        this.subscriptionChannel = this.server.createChannel({
            json: false,
            setup: async (channel: Channel) => {
                await channel.assertExchange(
                    this.options.exchange.name,
                    this.options.exchange.type,
                    {
                        durable: this.options.exchange.durable,
                        arguments: this.options.exchange.arguments,
                    }
                );

                await channel.prefetch(
                    this.options.prefetchCount ?? 0,
                    this.options.isGlobalPrefetchCount ?? false
                );
            },
        });
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

    public async send<T>(routingKey: string, message: T) {
        await this.clientChannel.publish(
            this.options.exchange.name,
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

                    const msgContent = msg.content.toString();

                    const response: TRMQResponse =
                        await handler.discoveredMethod.parentClass[
                            handler.discoveredMethod.methodName
                        ](JSON.parse(msgContent));

                    if (response === 'nack') {
                        channel.nack(msg, false, false);
                    } else {
                        channel.ack(msg, false);
                    }
                });
            }
        );
    }
}
