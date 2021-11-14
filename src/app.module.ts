import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GraphQLModule } from '@nestjs/graphql';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { LoggerModule } from './logger/logger.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule} from '@nestjs/config'
import { get, set } from 'lodash';
import { decode } from './utils/jwt.utils';
// import { HttpErrorFilter } from './middleware_logger/http-error.filter';
// import { AppLoggerMiddleware } from './middleware_logger/log.request';
import { AppointmentModule } from './appointment/appointment.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    GraphQLModule.forRoot({
      autoSchemaFile: 'graphql-schema.gql',
      context: ({ req, res }) => {
        // console.log(req.cookies);
        // Get the cookie from request
        const token = get(req, 'cookies.bitech');
        // console.log(token );
        // Verify the cooki
        const user = token ? decode(token) : null;
        //console.log(user);
        // Attach the user object to the request object
        if (user) {
          set(req, 'user', user);
        }
        //console.log(req.user);
        
        // console.log(`This is req.user ` + req.user);
        return { req, res };
      },
    }),
    UsersModule,
    AppointmentModule,
    PrismaModule,
    LoggerModule,
    AuthModule,
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