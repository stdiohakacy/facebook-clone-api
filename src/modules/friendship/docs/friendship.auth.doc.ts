import { applyDecorators } from '@nestjs/common';
import { ENUM_DOC_REQUEST_BODY_TYPE } from 'src/core/doc/constants/doc.enum.constant';
import {
    Doc,
    DocAuth,
    DocRequest,
    DocResponse,
} from 'src/core/doc/decorators/doc.decorator';

export function FriendshipAuthRequestDoc(): MethodDecorator {
    return applyDecorators(
        Doc({ operation: 'modules.auth.friendship' }),
        DocAuth({ jwtAccessToken: true }),
        DocRequest({ bodyType: ENUM_DOC_REQUEST_BODY_TYPE.JSON }),
        DocResponse('friendship.request')
    );
}
