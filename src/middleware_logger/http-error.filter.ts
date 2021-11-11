// import {
//   ArgumentsHost,
//   Catch,
//   ExceptionFilter,
//   HttpException,
//   Request,
//   Logger,
// } from '@nestjs/common';
// import * as request from 'supertest';
// import { LoggerService } from '../logger/logger.service';

// @Catch()
// export class HttpErrorFilter implements ExceptionFilter {
//   private readonly logger: LoggerService = new Logger(HttpErrorFilter.name);
//   catch(exception: HttpException, host: ArgumentsHost) {
//     const ctx = host.switchToHttp();
//     const request = ctx.getRequest();
//     const response = ctx.getResponse();
//     const status = exception.getStatus();

//     const errorResponse = {
//       code: status,
//       timestamp: new Date().toLocaleDateString(),
//       path: request.url,
//       method: request.method,
//       message: exception.message || null,
//     };

//     this.logger.error(`${request.url}`,JSON.stringify(errorResponse), 'ExceptionFilter');

//     response.status.json(errorResponse);
//   }
// }
