import { Logger } from '@nestjs/common';

export function logError(logger: Logger, error: any, methodName: string) {
  return logger.error({
    methodName,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    message: [error.message],
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    stack: error.stack,
  });
}
