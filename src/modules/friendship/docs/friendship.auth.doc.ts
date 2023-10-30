import { applyDecorators } from '@nestjs/common';
import { ENUM_DOC_REQUEST_BODY_TYPE } from 'src/core/doc/constants/doc.enum.constant';
import {
    Doc,
    DocAuth,
    DocRequest,
    DocResponse,
    DocResponsePaging,
} from 'src/core/doc/decorators/doc.decorator';
import { FriendshipListSerialization } from '../serializations/friendship.list.serialization';

export function FriendshipAuthRequestDoc(): MethodDecorator {
    return applyDecorators(
        Doc({ operation: 'modules.auth.friendship' }),
        DocAuth({ jwtAccessToken: true }),
        DocRequest({ bodyType: ENUM_DOC_REQUEST_BODY_TYPE.JSON }),
        DocResponse('friendship.request')
    );
}

export function FriendshipAuthAcceptRequestDoc(): MethodDecorator {
    return applyDecorators(
        Doc({ operation: 'modules.auth.friendship' }),
        DocAuth({ jwtAccessToken: true }),
        DocRequest({ bodyType: ENUM_DOC_REQUEST_BODY_TYPE.JSON }),
        DocResponse('friendship.acceptRequest')
    );
}

export function FriendshipAuthRejectRequestDoc(): MethodDecorator {
    return applyDecorators(
        Doc({ operation: 'modules.auth.friendship' }),
        DocAuth({ jwtAccessToken: true }),
        DocRequest({ bodyType: ENUM_DOC_REQUEST_BODY_TYPE.JSON }),
        DocResponse('friendship.rejectRequest')
    );
}

export function FriendshipAuthListDoc(): MethodDecorator {
    return applyDecorators(
        Doc({ operation: 'module.auth.friendship' }),
        DocAuth({ jwtAccessToken: true }),
        DocResponsePaging<FriendshipListSerialization>('friendship.list', {
            serialization: FriendshipListSerialization,
        })
    );
}
