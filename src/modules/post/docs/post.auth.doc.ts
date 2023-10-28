import { applyDecorators } from '@nestjs/common';
import { ENUM_DOC_REQUEST_BODY_TYPE } from 'src/core/doc/constants/doc.enum.constant';
import {
    Doc,
    DocAuth,
    DocRequest,
    DocResponse,
    DocResponsePaging,
} from 'src/core/doc/decorators/doc.decorator';
import { PostDocParamsId } from '../constants/post.doc.constant';
import { PostGetSerialization } from '../serializations/post.get.serialization';
import { PostListSerialization } from '../serializations/post.list.serialization';

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

export function PostAuthDeleteDoc(): MethodDecorator {
    return applyDecorators(
        Doc({ operation: 'modules.auth.post' }),
        DocAuth({ jwtAccessToken: true }),
        DocRequest({ params: PostDocParamsId }),
        DocResponse('post.delete')
    );
}

export function PostAuthGetDoc(): MethodDecorator {
    return applyDecorators(
        Doc({ operation: 'modules.auth.post' }),
        DocRequest({ params: PostDocParamsId }),
        DocAuth({ jwtAccessToken: true }),
        // DocGuard({ role: true, policy: true }),
        DocResponse<PostGetSerialization>('post.get', {
            serialization: PostGetSerialization,
        })
    );
}

export function PostAuthListDoc(): MethodDecorator {
    return applyDecorators(
        Doc({ operation: 'module.auth.post' }),
        DocAuth({ jwtAccessToken: true }),
        DocResponsePaging<PostListSerialization>('post.list', {
            serialization: PostListSerialization,
        })
    );
}
