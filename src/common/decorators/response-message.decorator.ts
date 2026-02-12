import { CustomDecorator, SetMetadata } from '@nestjs/common';

export const ResponseMessage = (message: string): CustomDecorator<string> =>
  SetMetadata('response-message', message);
