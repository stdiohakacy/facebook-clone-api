import { PickType } from '@nestjs/swagger';
import { CommentDTO } from './comment.dto';

export class CommentUpdateDTO extends PickType(CommentDTO, [
    'content',
    'updatedBy',
]) {}
