import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import DomainErrorTranslator from 'src/Commons/exceptions/DomainErrorTranslator';
import ClientError from 'src/Commons/exceptions/ClientError';

@Catch()
export class CatchEverythingFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();

    // 1. Domain + Client Errors
    if (exception instanceof Error) {
      const translatedError = DomainErrorTranslator.translate(exception);

      if (translatedError instanceof ClientError) {
        const responseBody = {
          status: 'fail',
          message: translatedError.message,
        };
        httpAdapter.reply(
          ctx.getResponse(),
          responseBody,
          translatedError.statusCode,
        );
        return;
      }
    }

    // 2. NestJS HttpException
    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const res = exception.getResponse();
      const message =
        typeof res === 'string'
          ? res
          : (res as Record<string, unknown>)?.['message'];

      const responseBody = {
        status: 'fail',
        message: message ?? 'Unexpected error',
      };
      httpAdapter.reply(ctx.getResponse(), responseBody, status);
      return;
    }

    // 3. Handle weird non-Error cases (string, object, number, etc.)
    const fallbackMessage =
      typeof exception === 'string'
        ? exception
        : typeof exception === 'object' && exception !== null
          ? JSON.stringify(exception)
          : 'terjadi kegagalan pada server kami';

    const responseBody = {
      status: 'error',
      message: fallbackMessage,
      timestamp: new Date().toISOString(),
      path: httpAdapter.getRequestUrl(ctx.getRequest()) as string,
    };

    httpAdapter.reply(
      ctx.getResponse(),
      responseBody,
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
