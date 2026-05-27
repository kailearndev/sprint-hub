import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
} from '@nestjs/common';
import type { Response } from 'express';
import { map, type Observable } from 'rxjs';

type ApiSuccessResponse<T> = {
    success: true;
    statusCode: number;
    message: string;
    data: T | null;
};

type ResponseWithMessage<T> = {
    message?: string;
    data?: T;
};

@Injectable()
export class ResponseInterceptor<T>
    implements NestInterceptor<T, ApiSuccessResponse<T>>
{
    intercept(
        context: ExecutionContext,
        next: CallHandler<T>,
    ): Observable<ApiSuccessResponse<T>> {
        const response = context.switchToHttp().getResponse<Response>();

        return next.handle().pipe(
            map((body) => {
                const normalizedBody = body as ResponseWithMessage<T>;
                const hasBodyObject = body !== null && typeof body === 'object';
                const hasDataField = hasBodyObject && 'data' in normalizedBody;
                const hasMessageField = hasBodyObject && 'message' in normalizedBody;

                return {
                    success: true,
                    statusCode: response.statusCode,
                    message:
                        hasMessageField && typeof normalizedBody.message === 'string'
                            ? normalizedBody.message
                            : 'Success',
                    data: hasDataField ? normalizedBody.data ?? null : body ?? null,
                };
            }),
        );
    }
}
