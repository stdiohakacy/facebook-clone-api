import { applyDecorators, SetMetadata } from '@nestjs/common';
import { IRouteOptions } from '../interfaces/rmq.interface';
import {
    RMQ_PROVIDER_OPTIONS,
    RMQ_ROUTES_OPTIONS,
} from '../constants/rmq.constant';

export const RMQSubscription = (options: IRouteOptions): MethodDecorator => {
    return applyDecorators(
        SetMetadata(RMQ_ROUTES_OPTIONS, {
            ...options,
        })
    );
};

export const RMQProvider = (): ClassDecorator => {
    return applyDecorators(SetMetadata(RMQ_PROVIDER_OPTIONS, {}));
};
