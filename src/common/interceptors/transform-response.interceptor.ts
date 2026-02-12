import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Response } from 'express';
import { map, Observable } from 'rxjs';

export interface ResponseFormat<T> {
  statusCode: number;
  message: string;
  data: T;
}

@Injectable()
export class TransformResopnseInterceptor<T> implements NestInterceptor<
  T,
  ResponseFormat<T>
> {
  constructor(private reflector: Reflector) {}
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ResponseFormat<T>> {
    const message =
      this.reflector.get<string>('response-message', context.getHandler()) ||
      'Request successfull';
    return next.handle().pipe(
      map((data: T) => ({
        statusCode: context.switchToHttp().getResponse<Response>().statusCode,
        message: message,
        data: data,
      })),
    );
  }
}
