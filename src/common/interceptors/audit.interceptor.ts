// // common/interceptors/audit.interceptor.ts

//^^ tidak digunakan,, gunakan di base service
// import {
//   Injectable,
//   NestInterceptor,
//   ExecutionContext,
//   CallHandler,
// } from '@nestjs/common';
// import { Observable } from 'rxjs';
// import { tap } from 'rxjs/operators';
// import { Request } from 'express';

// @Injectable()
// export class AuditInterceptor implements NestInterceptor {
//   intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
//     const ctx = context.switchToHttp();
//     const req = ctx.getRequest<Request>();
//     const user = req.user as { username: string } | undefined;
//     const method = req.method;
//     const username = user?.username || 'system'; // fallback buat non-authenticated system call

//     return next.handle().pipe(
//       tap((data) => {
//         const now = new Date();

//         const injectAudit = (entity: any) => {
//           // Cek apakah entitas extend AuditEntity
//           if (
//             entity &&
//             'createdBy' in entity &&
//             'updatedBy' in entity &&
//             typeof entity === 'object'
//           ) {
//             if (method === 'POST') {
//               entity.createdBy = username;
//               entity.createdAt = now;
//             }
//             entity.updatedBy = username;
//             entity.updatedAt = now;
//           }
//         };

//         if (Array.isArray(data)) {
//           data.forEach(injectAudit);
//         } else {
//           injectAudit(data);
//         }
//       }),
//     );
//   }
// }
