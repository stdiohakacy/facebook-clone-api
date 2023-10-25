import { BaseEntity, IBaseEntity } from '../../../core/base/entity/base.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { PostDTO } from '../dtos/post.dto';
import { UseDTO } from '../../../core/base/decorator/use-dto.decorator';
import { UserEntity } from '../../../modules/user/entities/user.entity';
import { CommentEntity } from '../../../modules/comment/entities/comment.entity';
import { PostUpdateDTO } from '../dtos/post.update.dto';

export interface IPostEntity extends IBaseEntity<PostDTO> {
    content: string;
    userId: string;
}

@Entity({ name: 'posts' })
@UseDTO(PostDTO)
export class PostEntity extends BaseEntity<PostDTO> implements IPostEntity {
    @Column({ name: 'content' })
    content: string;

    @Column({ name: 'userId', type: 'uuid' })
    userId: string;

    @ManyToOne(() => UserEntity, (user) => user.posts)
    @JoinColumn({ name: 'userId' })
    user?: UserEntity;

    @OneToMany(() => CommentEntity, (comments) => comments.post)
    comments?: CommentEntity[];
}
