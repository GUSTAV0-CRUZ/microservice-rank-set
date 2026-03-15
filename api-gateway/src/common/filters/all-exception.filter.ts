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

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    if (exception?.message.includes('not found')) status = 404;

    // logger.log('exception: ', exception);
    // logger.log('ctx: ', ctx);
    // logger.log('response: ', response);
    // logger.log('request: ', request);

    this.logger.error({
      path: request.path,
      status,
      method: request.method,
      message,
    });

    response.status(status).json({
      statusCode: status,
      timeStamp: new Date(),
      path: request.path,
      message,
    });
  }
}
