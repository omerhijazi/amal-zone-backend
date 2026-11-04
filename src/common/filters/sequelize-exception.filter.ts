import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpStatus,
    Logger,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import {
    UniqueConstraintError,
    ForeignKeyConstraintError,
    ValidationError,
    ValidationErrorItem,
    DatabaseError,
    ConnectionError,
    TimeoutError,
    EmptyResultError,
    OptimisticLockError,
    BaseError,
} from 'sequelize';

@Catch(BaseError)
export class SequelizeExceptionFilter implements ExceptionFilter {
    private readonly logger = new Logger(SequelizeExceptionFilter.name);

    catch(error: BaseError, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        let status = HttpStatus.INTERNAL_SERVER_ERROR;
        let message: string | string[] = 'A database error occurred';

        if (error instanceof UniqueConstraintError) {
            status = HttpStatus.CONFLICT;
            // Safely extract field names from error.errors or error.fields
            const fields = error.errors?.map((e) => e.path).filter(Boolean);
            message = fields?.length
                ? `A record with this ${fields.join(', ')} already exists`
                : error.message;
        } else if (error instanceof ForeignKeyConstraintError) {
            status = HttpStatus.BAD_REQUEST;
            message = `Invalid reference: the referenced resource does not exist`;
        } else if (error instanceof ValidationError) {
            status = HttpStatus.BAD_REQUEST;
            message = error.errors.map((e) => `${e.path}: ${e.message}`);
        } else if (error instanceof EmptyResultError) {
            status = HttpStatus.NOT_FOUND;
            message = 'Item/Items do not exist '
        }

        // Log the real query and stack trace for 500s
        if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
            this.logger.error(
                `[${request.method} ${request.url}] ${error.message}`,
                (error as any).sql || error.stack,
            );
        }

        response.status(status).json({
            statusCode: status,
            message,
            error: HttpStatus[status],
            timestamp: new Date().toISOString(),
            path: request.url,
        });
    }
}
