import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import type { Request, Response } from 'express';

type NestErrorResponse = {
    statusCode?: number;
    message?: string | string[];
    error?: string;
    errors?: unknown;
};

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const request = ctx.getRequest<Request>();
        const response = ctx.getResponse<Response>();

        const isHttpException = exception instanceof HttpException;
        const statusCode = isHttpException
            ? exception.getStatus()
            : HttpStatus.INTERNAL_SERVER_ERROR;

        const exceptionResponse = isHttpException
            ? exception.getResponse()
            : undefined;

        const errorBody =
            typeof exceptionResponse === 'object' && exceptionResponse !== null
                ? (exceptionResponse as NestErrorResponse)
                : undefined;

        const rawMessage =
            typeof exceptionResponse === 'string'
                ? exceptionResponse
                : errorBody?.message;

        const validationErrors = Array.isArray(rawMessage) ? rawMessage : null;

        response.status(statusCode).json({
            success: false,
            statusCode,
            message: validationErrors
                ? errorBody?.error || 'Validation failed'
                : rawMessage || 'Internal server error',
            errors: validationErrors || errorBody?.errors || null,
            path: request.url,
            timestamp: new Date().toISOString(),
        });
    }
}
