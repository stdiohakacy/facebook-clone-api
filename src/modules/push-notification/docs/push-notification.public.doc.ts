import { HttpStatus, applyDecorators } from '@nestjs/common';
import { ENUM_DOC_REQUEST_BODY_TYPE } from 'src/core/doc/constants/doc.enum.constant';
import {
    Doc,
    DocRequest,
    DocResponse,
} from 'src/core/doc/decorators/doc.decorator';

export function PushNotificationPublicSendDoc(): MethodDecorator {
    return applyDecorators(
        Doc({ operation: 'modules.public.pushNotification' }),
        DocRequest({ bodyType: ENUM_DOC_REQUEST_BODY_TYPE.JSON }),
        DocResponse('pushNotification.send', {
            httpStatus: HttpStatus.CREATED,
        })
    );
}
