/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class allExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(allExceptionFilter.name);

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const message = exception?.response?.message || [exception?.message] || [
        'Internal server error',
      ];

    let status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.BAD_REQUEST;

    const errorMessage = String(message).toLowerCase();
    if (errorMessage.includes('not found')) {
      status = HttpStatus.NOT_FOUND;
    }

    // logger.log('exception: ', exception);
    // logger.log('ctx: ', ctx);
    // logger.log('response: ', response);
    // logger.log('request: ', request);

    this.logger.error({
      path: request.path,
      status,
      method: request.method,
      message,
      stack: exception?.stack,
    });

    response.status(status).json({
      statusCode: status,
      timeStamp: new Date(),
      path: request.path,
      message,
    });
  }
}
