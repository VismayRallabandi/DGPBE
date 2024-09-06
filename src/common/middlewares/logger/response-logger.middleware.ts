import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction } from 'express';

@Injectable()
export class ResponseMiddleware implements NestMiddleware {
  use(req: any, res: any, next: NextFunction) {
    // Intercept responses
    const originalJson = res.json;

    res.json = function (body: any) {
      if (res.statusCode >= 400) {
        // Error response
        console.log(body);
        const errorResponse = {
          success: false,
          message: body.message || 'Failed',
          errors: body.error || null,
        };
        return originalJson.call(this, errorResponse);
      } else {
        // Success response
        const successResponse: any = {
          success: true,
          message: body.message || 'Success',
          data: body.data || null,
        };
        return originalJson.call(this, successResponse);
      }
    };

    next();
  }
}