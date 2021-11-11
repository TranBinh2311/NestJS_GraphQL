import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GraphQLModule } from '@nestjs/graphql';
import { UsersModule } from './users/users.module';
import { AppointmentModule } from './appointment/appointment.module';
import { PrismaModule } from './prisma/prisma.module';
import { LoggerModule } from './logger/logger.module';
import { AuthModule } from './auth/auth.module';
import * as request from 'supertest';
import { APP_FILTER } from '@nestjs/core';
// import { HttpErrorFilter } from './middleware_logger/http-error.filter';
// import { AppLoggerMiddleware } from './middleware_logger/log.request';


@Module({
  imports: [
    GraphQLModule.forRoot({
      autoSchemaFile: 'graphql-schema.gql',
      context: (({req}) => ({headers: req.headers})),
    }),
    UsersModule,
    AppointmentModule,
    PrismaModule,
    LoggerModule,
    AuthModule
  ],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule{}
// export class AppModule implements NestModule {
//   configure(consumer: MiddlewareConsumer): void {
//     consumer.apply(AppLoggerMiddleware).forRoutes('*');
//   }
// }