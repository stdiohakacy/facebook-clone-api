import {
    ENUM_USER_STATUS,
    ENUM_USER_TYPE,
} from 'src/modules/user/constants/user.enum.constant';
import { UserEntity } from 'src/modules/user/entities/user.entity';

export const userStub = (): UserEntity => {
    const user = new UserEntity();
    user.id = 'f416a878-54d4-42cb-a722-4b4b6fa3701f';
    user.username = 'Kristofer_Marquardt';
    user.password = {
        salt: '$2a$08$QHdNA58AnesaOQoQF2Z.nu',
        passwordHash:
            '$2a$08$QHdNA58AnesaOQoQF2Z.nu0J/7z7DpcghTmH2U786hrP.kaTQqgKW',
        passwordCreated: new Date('2023-10-07T07:10:00.109Z'),
        passwordExpired: new Date('2024-04-06T07:10:00.108Z'),
    };
    user.status = ENUM_USER_STATUS.NONE;
    user.type = ENUM_USER_TYPE.PARKING_AGENT;
    user.name = 'Terrence Powlowski-Jacobi';
    user.address = '386 Luciano Fort Curtisworth 95966 Cambodia';
    user.email = 'Trever80@gmail.com';
    user.phone = '1-214-747-7267 x4565';

    return user;
};
