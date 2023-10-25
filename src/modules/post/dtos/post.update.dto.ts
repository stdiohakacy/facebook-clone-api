import { PickType } from '@nestjs/swagger';
import { PostDTO } from './post.dto';

export class PostUpdateDTO extends PickType(PostDTO, ['content']) {}
