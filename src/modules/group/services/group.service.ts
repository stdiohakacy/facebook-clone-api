import { Injectable, NotFoundException } from '@nestjs/common';
import { GroupEntity } from '../entities/group.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { GroupCreateDTO } from '../dtos/group.create.dto';
import { instanceToPlain } from 'class-transformer';
import { ENUM_GROUP_ERROR } from '../constants/group.status-code.constant';
import { GroupUpdateDTO } from '../dtos/group.update.dto';

@Injectable()
export class GroupService {
    constructor(
        @InjectRepository(GroupEntity)
        private readonly groupRepo: Repository<GroupEntity>
    ) {}

    async create(dto: GroupCreateDTO) {
        try {
            const groupCreated = await this.groupRepo.save(
                this.groupRepo.create(dto)
            );

            return instanceToPlain({ data: groupCreated });
        } catch (error) {
            console.error(error);
        }
    }

    async getById(id: string) {
        const group = await this.groupRepo.findOne({ where: { id } });
        if (!group) {
            throw new NotFoundException({
                statusCode: ENUM_GROUP_ERROR.GROUP_NOT_FOUND_ERROR,
                message: 'group.error.notFound',
            });
        }

        return instanceToPlain({ data: group });
    }

    async update(id: string, dto: GroupUpdateDTO) {
        const group = await this.groupRepo.findOne({ where: { id } });
        if (!group) {
            throw new NotFoundException({
                statusCode: ENUM_GROUP_ERROR.GROUP_NOT_FOUND_ERROR,
                message: 'group.error.notFound',
            });
        }

        await this.groupRepo.update(id, dto);
    }

    // async delete(id: string) {
    //     const group = await this.groupRepo.findOne({ where: { id } });
    //     if (!group) {
    //         throw new NotFoundException({
    //             statusCode: ENUM_GROUP_ERROR.GROUP_NOT_FOUND_ERROR,
    //             message: 'group.error.notFound',
    //         });
    //     }
    // }
}
