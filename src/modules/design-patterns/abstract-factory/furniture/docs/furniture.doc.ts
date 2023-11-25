import { applyDecorators } from '@nestjs/common';
import { ENUM_DOC_REQUEST_BODY_TYPE } from 'src/core/doc/constants/doc.enum.constant';
import {
    Doc,
    DocRequest,
    DocResponse,
} from 'src/core/doc/decorators/doc.decorator';

export function FurnitureCreateDoc(): MethodDecorator {
    return applyDecorators(
        Doc({ operation: 'modules.auth.furniture' }),
        DocRequest({ bodyType: ENUM_DOC_REQUEST_BODY_TYPE.JSON }),
        DocResponse('furniture.create')
    );
}
