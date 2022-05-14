import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common';

@Catch(HttpException)
export class CustomExceptionFilter<T extends HttpException> implements ExceptionFilter {
  public catch(exception: T, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    let errorResponse = exception.getResponse();
    if (!(errorResponse instanceof ErrorResponse)) errorResponse = new ErrorResponse((errorResponse as Error).message);
    response.status(exception.getStatus()).json(errorResponse);
  }
}

export class JsonResponse {
  constructor(public hasError: boolean, public message: string, public data?: any) {}
}

export class ErrorResponse extends JsonResponse {
  constructor(message: string, data?: any) {
    super(true, message, data);
  }
}
export class SuccessResponse extends JsonResponse {
  constructor(data?: any, message = 'OK') {
    super(false, message, data);
  }
}
