import { Request } from 'express';
import { Observable, map } from 'rxjs';
import { AllItemsResponse, PaginationResponse } from '~/application/responses';
import { DefaultPaginationParams } from '~/common/constants';
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';

@Injectable()
export class PaginationInterceptor<T>
  implements NestInterceptor<T, PaginationResponse<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ):
    | Observable<PaginationResponse<T>>
    | Promise<Observable<PaginationResponse<T>>> {
    const request = context.switchToHttp().getRequest<Request>();
    const queryParams = request.query;

    const enablePagination = !!(
      queryParams.noPagination && queryParams.noPagination === 'false'
    );
    let page = parseInt(queryParams.page as string);
    let limit = parseInt(queryParams.limit as string);

    if (enablePagination) {
      page = page || DefaultPaginationParams.PAGE;
      limit = limit || DefaultPaginationParams.LIMIT;
    }

    request.query = {
      ...queryParams,
      page: page.toString(),
      limit: limit.toString(),
    };

    return next.handle().pipe(
      map((data) => {
        const { count, data: items } = data as AllItemsResponse<T>;

        const previous = enablePagination && page > 1 ? page - 1 : null;
        const next = enablePagination && page * limit < count ? page + 1 : null;

        return {
          previous,
          next,
          count,
          data: items,
        };
      }),
    );
  }
}
