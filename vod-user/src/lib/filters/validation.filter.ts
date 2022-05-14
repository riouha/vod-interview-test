import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common';
import { ValidationError } from 'class-validator';
import { JsonResponse } from './http-exception.filter';
//===========================================================
const validatoionErrorToObjectError = (validationError: ValidationError) => {
  const recFunc = (verr: ValidationError, obj: any) => {
    if (!verr.children?.length) obj[verr.property] = Object.values(verr.constraints).toString();
    else {
      for (let i = 0; i < verr.children.length; i++) {
        const result = recFunc(verr.children[i], {});
        obj[verr.property] = { ...obj[verr.property], ...result };
      }
    }
    return obj;
  };

  return recFunc(validationError, {});
};

export class ValidationException {
  constructor(public errors: { [key: string]: string[] }) {}
}

export const ValidationExceptionFactory = (validationErrors: ValidationError[]) => {
  // console.log(validationErrors.map((x) => x.children[0]?.target));

  const errorsObj: any = {};
  for (const validationError of validationErrors) {
    Object.assign(errorsObj, validatoionErrorToObjectError(validationError));
    //   errorsObj[validationError.property] = Object.values(validationError.constraints);
  }
  return new ValidationException(errorsObj);
};

@Catch(ValidationException)
export class ValidationExceptionFilter implements ExceptionFilter<ValidationException> {
  public catch(exception: ValidationException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    response
      .status(HttpStatus.BAD_REQUEST)
      .json(new JsonResponse(true, 'Validation failed. Check your inputs.', exception.errors));
  }
}
