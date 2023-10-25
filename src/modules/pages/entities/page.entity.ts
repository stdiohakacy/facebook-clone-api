import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity, IBaseEntity } from '../../../core/base/entity/base.entity';
import { UseDTO } from '../../../core/base/decorator/use-dto.decorator';
import { PageDTO } from '../dtos/page.dto';
import { PageFollowEntity } from '../../../modules/page-follow/entities/page-follow.entity';

export interface IPageEntity extends IBaseEntity<PageDTO> {
    name: string;
    description: string;
}
@Entity({ name: 'pages' })
@UseDTO(PageDTO)
export class PageEntity extends BaseEntity<PageDTO> implements IPageEntity {
    @Column({ name: 'name', unique: true })
    name: string;

    @Column({ name: 'description' })
    description: string;

    @OneToMany(() => PageFollowEntity, (pageFollows) => pageFollows.page)
    pageFollows?: PageFollowEntity[];
}
