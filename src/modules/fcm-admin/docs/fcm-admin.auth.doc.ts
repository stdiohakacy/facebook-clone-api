import { applyDecorators } from '@nestjs/common';
import { ENUM_DOC_REQUEST_BODY_TYPE } from 'src/core/doc/constants/doc.enum.constant';
import {
    Doc,
    DocAuth,
    DocRequest,
    DocResponse,
} from 'src/core/doc/decorators/doc.decorator';

export function FcmAdminAuthSubscriptionToTopicDoc(): MethodDecorator {
    return applyDecorators(
        Doc({ operation: 'modules.auth.fcm' }),
        DocAuth({ jwtAccessToken: true }),
        DocRequest({ bodyType: ENUM_DOC_REQUEST_BODY_TYPE.JSON }),
        DocResponse('fcm.subscriptionToTopic')
    );
}

export function FcmAdminAuthToggleSubscriptionDoc(): MethodDecorator {
    return applyDecorators(
        Doc({ operation: 'modules.auth.fcm' }),
        DocAuth({ jwtAccessToken: true }),
        DocRequest({ bodyType: ENUM_DOC_REQUEST_BODY_TYPE.JSON }),
        DocResponse('post.create')
    );
}

export function FcmAdminAuthPushNotificationDoc(): MethodDecorator {
    return applyDecorators(
        Doc({ operation: 'modules.auth.fcm' }),
        DocAuth({ jwtAccessToken: true }),
        DocRequest({ bodyType: ENUM_DOC_REQUEST_BODY_TYPE.JSON }),
        DocResponse('fcm.pushNotification')
    );
}

export function FcmAdminAuthMulticastPushNotificationDoc(): MethodDecorator {
    return applyDecorators(
        Doc({ operation: 'modules.auth.fcm' }),
        DocAuth({ jwtAccessToken: true }),
        DocRequest({ bodyType: ENUM_DOC_REQUEST_BODY_TYPE.JSON }),
        DocResponse('fcm.multicastPushNotification')
    );
}

export function FcmAdminAuthPushNotificationToTopicDoc(): MethodDecorator {
    return applyDecorators(
        Doc({ operation: 'modules.auth.fcm' }),
        DocAuth({ jwtAccessToken: true }),
        DocRequest({ bodyType: ENUM_DOC_REQUEST_BODY_TYPE.JSON }),
        DocResponse('fcm.pushNotificationToTopic')
    );
}
