import { applyDecorators } from '@nestjs/common';
import { ENUM_DOC_REQUEST_BODY_TYPE } from 'src/core/doc/constants/doc.enum.constant';
import {
    Doc,
    DocAuth,
    DocRequest,
    DocResponse,
} from 'src/core/doc/decorators/doc.decorator';
import { PostDocParamsId } from 'src/modules/post/constants/post.doc.constant';
import { GroupGetSerialization } from '../serializations/group.get.serialization';
import { GroupDocParamsId } from '../constants/group.doc.constant';

export function GroupAuthCreateDoc(): MethodDecorator {
    return applyDecorators(
        Doc({ operation: 'modules.auth.group' }),
        DocAuth({ jwtAccessToken: true }),
        DocRequest({ bodyType: ENUM_DOC_REQUEST_BODY_TYPE.JSON }),
        DocResponse('group.create')
    );
}

export function GroupAuthGetDoc(): MethodDecorator {
    return applyDecorators(
        Doc({ operation: 'modules.auth.group' }),
        DocRequest({ params: GroupDocParamsId }),
        DocAuth({ jwtAccessToken: true }),
        DocResponse<GroupGetSerialization>('group.get', {
            serialization: GroupGetSerialization,
        })
    );
}

export function GroupAuthUpdateDoc(): MethodDecorator {
    return applyDecorators(
        Doc({ operation: 'modules.auth.group' }),
        DocAuth({ jwtAccessToken: true }),
        DocRequest({ bodyType: ENUM_DOC_REQUEST_BODY_TYPE.JSON }),
        DocResponse('group.update')
    );
}
