import { PickType } from '@nestjs/swagger';
import { PostDTO } from './post.dto';

export class PostCreateDTO extends PickType(PostDTO, ['content', 'userId']) {}
