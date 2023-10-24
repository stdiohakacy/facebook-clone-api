import { applyDecorators } from '@nestjs/common';
import { Doc, DocResponse } from 'src/core/doc/decorators/doc.decorator';
import { MessageLanguageSerialization } from 'src/core/message/serializations/message.language.serialization';

export function MessagePublicLanguageDoc(): MethodDecorator {
    return applyDecorators(
        Doc({ operation: 'common.public.message' }),
        DocResponse<MessageLanguageSerialization>('apiKey.languages', {
            serialization: MessageLanguageSerialization,
        })
    );
}
