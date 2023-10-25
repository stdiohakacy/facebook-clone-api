import { ApiHideProperty, OmitType, PickType } from '@nestjs/swagger';
import { ENUM_PAGINATION_ORDER_DIRECTION_TYPE } from 'src/core/pagination/constants/pagination.enum.constant';
import { IPaginationOrder } from 'src/core/pagination/interfaces/pagination.interface';

export class PaginationListDTO {
    @ApiHideProperty()
    _search: Record<string, any>;

    @ApiHideProperty()
    _limit: number;

    @ApiHideProperty()
    _offset: number;

    @ApiHideProperty()
    _order: IPaginationOrder;

    @ApiHideProperty()
    _availableOrderBy: string[];

    @ApiHideProperty()
    _availableOrderDirection: ENUM_PAGINATION_ORDER_DIRECTION_TYPE[];
}

export class PaginationOmitListDTO extends OmitType(PaginationListDTO, [
    '_availableOrderBy',
    '_availableOrderDirection',
] as const) {}
