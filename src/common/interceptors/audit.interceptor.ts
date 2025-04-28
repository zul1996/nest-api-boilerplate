import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();

    const user = request.user; // Ini dari Passport-JWT
    if (request.body) {
      if (request.method === 'POST') {
        request.body.createdBy = user?.sub;
      }
      if (request.method === 'PATCH' || request.method === 'PUT') {
        request.body.updatedBy = user?.sub;
      }
    }

    return next.handle().pipe(map((data) => data));
  }
}
