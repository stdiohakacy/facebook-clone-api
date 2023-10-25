import { PickType } from '@nestjs/swagger';
import { CommentDTO } from './comment.dto';

export class CommentCreateDTO extends PickType(CommentDTO, [
    'userId',
    'postId',
    'content',
    'parentCommentId',
]) {}
