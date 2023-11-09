import { Injectable } from '@nestjs/common';
import { SubscriberEntity } from '../entities/subscriber.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class SubscriberService {
    constructor(
        @InjectRepository(SubscriberEntity)
        private readonly subscriberRepo: Repository<SubscriberEntity>
    ) {}

    async getByUsername(username: string) {
        const subscriber = await this.subscriberRepo.findOne({
            where: { username },
        });
        return subscriber;
    }

    async save(
        username: string,
        token: string,
        topic: string,
        subscribed: boolean
    ) {
        return await this.subscriberRepo.save(
            this.subscriberRepo.create({
                username,
                token,
                topic,
                subscribed,
            })
        );
    }

    async update(token: string, subscribed: boolean) {
        const subscribers = await this.subscriberRepo
            .createQueryBuilder('subscriber')
            .where('subscriber.token = :token', { token })
            .getMany();

        for (const subscriber of subscribers) {
            subscriber.subscribed = subscribed;
            await this.subscriberRepo.save(subscriber);
        }
    }
}
