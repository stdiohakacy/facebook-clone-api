import { applyDecorators } from '@nestjs/common';
import { functionsIn } from 'lodash';
import { ENUM_DOC_REQUEST_BODY_TYPE } from 'src/core/doc/constants/doc.enum.constant';
import {
    Doc,
    DocAuth,
    DocRequest,
    DocResponse,
    DocResponsePaging,
} from 'src/core/doc/decorators/doc.decorator';
import { CommentDocParamsId } from '../constants/comment.doc.constant';
import { CommentListSerialization } from '../serializations/comment.list.serialization';

export function CommentAuthCreateDoc(): MethodDecorator {
    return applyDecorators(
        Doc({ operation: 'modules.auth.comment' }),
        DocAuth({ jwtAccessToken: true }),
        DocRequest({ bodyType: ENUM_DOC_REQUEST_BODY_TYPE.JSON }),
        DocResponse('comment.create')
    );
}

export function CommentAuthUpdateDoc(): MethodDecorator {
    return applyDecorators(
        Doc({ operation: 'modules.auth.comment' }),
        DocAuth({ jwtAccessToken: true }),
        DocRequest({ bodyType: ENUM_DOC_REQUEST_BODY_TYPE.JSON }),
        DocResponse('comment.update')
    );
}

export function CommentAuthDeleteDoc(): MethodDecorator {
    return applyDecorators(
        Doc({ operation: 'modules.auth.comment' }),
        DocRequest({ params: CommentDocParamsId }),
        DocAuth({ jwtAccessToken: true }),
        // DocGuard({ role: true, policy: true }),
        DocResponse('comment.delete')
    );
}

export function CommentAuthListDoc(): MethodDecorator {
    return applyDecorators(
        Doc({ operation: 'module.auth.comment' }),
        // DocRequest({ queries: ApiKeyDocQueryIsActive }),
        DocAuth({ jwtAccessToken: true }),
        // DocGuard({ role: true, policy: true }),
        DocResponsePaging<CommentListSerialization>('comment.list', {
            serialization: CommentListSerialization,
        })
    );
}
