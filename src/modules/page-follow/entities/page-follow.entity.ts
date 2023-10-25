import { BaseEntity, IBaseEntity } from '../../../core/base/entity/base.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { UseDTO } from '../../../core/base/decorator/use-dto.decorator';
import { PageFollowDTO } from '../dtos/page-follow.dto';
import { UserEntity } from '../../../modules/user/entities/user.entity';
import { PageEntity } from '../../../modules/pages/entities/page.entity';

export interface IPageFollowEntity extends IBaseEntity<PageFollowDTO> {
    pageId: string;
    userId: string;
}

@Entity({ name: 'page_follows' })
@UseDTO(PageFollowDTO)
export class PageFollowEntity
    extends BaseEntity<PageFollowDTO>
    implements IPageFollowEntity
{
    @Column({ name: 'pageId', type: 'uuid' })
    pageId: string;

    @Column({ name: 'userId', type: 'uuid' })
    userId: string;

    @ManyToOne(() => UserEntity, (user) => user.pageFollows)
    @JoinColumn({ name: 'userId' })
    user?: UserEntity;

    @ManyToOne(() => PageEntity, (page) => page.pageFollows)
    @JoinColumn({ name: 'pageId' })
    page?: PageEntity;
}
