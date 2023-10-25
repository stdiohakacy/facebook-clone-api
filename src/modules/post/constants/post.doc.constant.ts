import { faker } from '@faker-js/faker';

export const PostDocParamsId = [
    {
        name: 'id',
        allowEmptyValue: false,
        required: true,
        type: 'string',
        example: faker.string.uuid(),
    },
];
