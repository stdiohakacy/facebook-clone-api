import { applyDecorators } from '@nestjs/common';
import { ENUM_DOC_REQUEST_BODY_TYPE } from 'src/core/doc/constants/doc.enum.constant';
import {
    Doc,
    DocAuth,
    DocRequest,
    DocResponse,
    DocResponsePaging,
} from 'src/core/doc/decorators/doc.decorator';
import { NotificationListSerialization } from '../serializations/notification.list.serialization';

export function NotificationAuthCreateDoc(): MethodDecorator {
    return applyDecorators(
        Doc({ operation: 'modules.auth.notification' }),
        DocAuth({ jwtAccessToken: true }),
        DocRequest({ bodyType: ENUM_DOC_REQUEST_BODY_TYPE.JSON }),
        DocResponse('notification.create')
    );
}

export function NotificationAuthReadDoc(): MethodDecorator {
    return applyDecorators(
        Doc({ operation: 'modules.auth.notification' }),
        DocAuth({ jwtAccessToken: true }),
        DocRequest({ bodyType: ENUM_DOC_REQUEST_BODY_TYPE.JSON }),
        DocResponse('notification.read')
    );
}

export function NotificationAuthListDoc(): MethodDecorator {
    return applyDecorators(
        Doc({ operation: 'module.auth.notification' }),
        DocAuth({ jwtAccessToken: true }),
        DocResponsePaging<NotificationListSerialization>('notification.list', {
            serialization: NotificationListSerialization,
        })
    );
}
