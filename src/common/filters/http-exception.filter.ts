import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const exceptionRes = exception.getResponse();

    // take error message (string or object)
    const message = this.extractMessage(exceptionRes, exception);

    response.status(status).json({
      statusCode: status,
      message: message,
      data: null,
    });
  }

  private extractMessage(
    exceptionRes: unknown,
    exception: HttpException,
  ): string {
    if (
      typeof exceptionRes === 'object' &&
      exceptionRes !== null &&
      'message' in exceptionRes
    ) {
      const msg = (exceptionRes as Record<string, unknown>).message;
      return typeof msg === 'string' ? msg : exception.message;
    }
    return typeof exceptionRes === 'string' ? exceptionRes : exception.message;
  }
}
