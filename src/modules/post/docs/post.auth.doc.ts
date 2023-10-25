import { applyDecorators } from '@nestjs/common';
import { ENUM_DOC_REQUEST_BODY_TYPE } from 'src/core/doc/constants/doc.enum.constant';
import {
    Doc,
    DocAuth,
    DocRequest,
    DocResponse,
} from 'src/core/doc/decorators/doc.decorator';

export function PostAuthCreateDoc(): MethodDecorator {
    return applyDecorators(
        Doc({ operation: 'modules.auth.post' }),
        DocAuth({ jwtAccessToken: true }),
        DocRequest({ bodyType: ENUM_DOC_REQUEST_BODY_TYPE.JSON }),
        DocResponse('post.create')
    );
}

export function PostAuthUpdateDoc(): MethodDecorator {
    return applyDecorators(
        Doc({ operation: 'modules.auth.post' }),
        DocAuth({ jwtAccessToken: true }),
        DocRequest({ bodyType: ENUM_DOC_REQUEST_BODY_TYPE.JSON }),
        DocResponse('post.update')
    );
}
