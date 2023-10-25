import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity, IBaseEntity } from '../../../core/base/entity/base.entity';
import { UseDTO } from '../../../core/base/decorator/use-dto.decorator';
import { CommentDTO } from '../dtos/comment.dto';
import { UserEntity } from '../../../modules/user/entities/user.entity';
import { PostEntity } from '../../../modules/post/entities/post.entity';

export interface ICommentEntity extends IBaseEntity<CommentDTO> {
    userId: string;
    postId: string;
    parentCommentId?: string;
    content: string;
}
@Entity({ name: 'comments' })
@UseDTO(CommentDTO)
export class CommentEntity
    extends BaseEntity<CommentDTO>
    implements ICommentEntity
{
    @Column({ name: 'userId', type: 'uuid' })
    userId: string;

    @Column({ name: 'postId', type: 'uuid' })
    postId: string;

    @Column({ name: 'parentCommentId', type: 'uuid', nullable: true })
    parentCommentId?: string;

    @Column({ name: 'content' })
    content: string;

    @ManyToOne(() => UserEntity, (user) => user.comments)
    @JoinColumn({ name: 'userId' })
    user?: UserEntity;

    @ManyToOne(() => PostEntity, (post) => post.comments)
    @JoinColumn({ name: 'postId' })
    post?: PostEntity;

    @OneToMany(() => CommentEntity, (comments) => comments.parentComment)
    comments?: CommentEntity[];

    @ManyToOne(() => CommentEntity, (parentComment) => parentComment.comments)
    @JoinColumn({ name: 'parentCommentId' })
    parentComment?: CommentEntity;
}
