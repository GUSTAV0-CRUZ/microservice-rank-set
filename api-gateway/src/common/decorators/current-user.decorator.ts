import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest<Request>();

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return req['user'];
  },
);
