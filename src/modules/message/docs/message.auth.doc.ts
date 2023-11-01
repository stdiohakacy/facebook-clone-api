import { applyDecorators } from '@nestjs/common';
import {
    Doc,
    DocAuth,
    DocRequest,
    DocResponse,
    DocResponsePaging,
} from 'src/core/doc/decorators/doc.decorator';
import { MessageListSerialization } from '../serializations/message.list.serialization';
import { ENUM_DOC_REQUEST_BODY_TYPE } from 'src/core/doc/constants/doc.enum.constant';

export function MessageAuthListDoc(): MethodDecorator {
    return applyDecorators(
        Doc({ operation: 'module.auth.message' }),
        DocAuth({ jwtAccessToken: true }),
        DocResponsePaging<MessageListSerialization>('message.list', {
            serialization: MessageListSerialization,
        })
    );
}

export function MessageAuthCreateDoc(): MethodDecorator {
    return applyDecorators(
        Doc({ operation: 'modules.auth.message' }),
        DocAuth({ jwtAccessToken: true }),
        DocRequest({ bodyType: ENUM_DOC_REQUEST_BODY_TYPE.JSON }),
        DocResponse('message.create')
    );
}
