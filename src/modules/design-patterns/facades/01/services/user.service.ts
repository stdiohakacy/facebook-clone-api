import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
    constructor() {}

    async getUserById(id: string) {
        return { id, username: 'user-01' };
    }
}
