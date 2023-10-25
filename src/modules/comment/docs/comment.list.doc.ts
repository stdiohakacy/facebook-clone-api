import { applyDecorators } from '@nestjs/common';
import {
    Doc,
    DocAuth,
    DocResponsePaging,
} from 'src/core/doc/decorators/doc.decorator';
import { CommentListSerialization } from '../serializations/comment.list.serialization';

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
