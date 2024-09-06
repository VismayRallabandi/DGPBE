import {
    CallHandler,
    ExecutionContext,
    HttpException,
    Injectable,
    NestInterceptor,
  } from '@nestjs/common';
  import { Observable, throwError } from 'rxjs';
  import { catchError, map } from 'rxjs/operators';
import { CustomResponseBodyType } from '../helpers/custom-response.helper';

  
  @Injectable()
  export class ResponseInterceptor<
    T = Record<string, any> | Array<Record<string, any>>,
  > implements NestInterceptor
  {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
      return next.handle().pipe(
        map((res: CustomResponseBodyType<T>) =>
          this.responseHandler(res, context),
        ),
        catchError((err: any) =>
          throwError(() => this.errorHandler(err, context)),
        ),
      );
    }
  
    errorHandler(error: any, context: ExecutionContext) {
      const ctx = context.switchToHttp();
      const response = ctx.getResponse();
      const request = ctx.getRequest();
  
      let statusCode = 500;
      let message = 'Internal Server Error';
      let data = null;
      if (error instanceof HttpException) {
        statusCode = error.getStatus();
        data = (error?.getResponse() as any)?.message || error.getResponse();
        message = error?.message || 'Http Exception';
      } else if (error?.response && error?.response?.statusCode) {
        statusCode = error?.response?.statusCode;
        message = error?.message || 'Something went wrong';
        data = error?.response?.message || error?.response;
      }
      console.error(`Error occurred at ${request?.url}:`, error);
      response.status(statusCode).send({
        success: false,
        statusCode,
        path: request.url,
        message,
        data,
      });
    }
  
    responseHandler(res: CustomResponseBodyType<T>, context: ExecutionContext) {
      const ctx = context.switchToHttp();
      const response = ctx.getResponse();
      const request = ctx.getRequest();
  
      const statusCode = response.statusCode || 200; // Default to 200 if status code is not set
  
      return {
        success: true,
        path: request.url,
        statusCode,
        message: res.message || 'Operation completed successfully',
        data: res.data,
      };
    }
  }