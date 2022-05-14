import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { ITokenPayload } from 'src/modules/auth/types/token-payload.interface';

export const GetUser = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  return <ITokenPayload>request.user;
});
