import { flatten, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as session from 'express-session';
import { AppModule } from './app.module';
import * as Store from 'connect-redis';
import { redis } from './redis';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const RedisStore = Store(session);
  const app = await NestFactory.create(AppModule);
  // Validation
  //app.useGlobalPipes(new ValidationPipe());

  // app.use(
  //   session({
  //     secret: 'keyboard cat',
  //     resave: false,
  //     saveUninitialized: true,
  //     cookie: { secure: false },
  //   }),
  // );
  app.use( cookieParser());

  await app.listen(3000);
}
bootstrap();


 // store: new RedisStore({
      //   client: redis as any
      // }),
      // name: "bitech",
      // secret: "hihihi" ,
      // resave: false,
      // saveUninitialized: true,
      // cookie: { 
      //   // httpOnly: true,
      //   secure: false,
      //   maxAge: 1000 * 60 *60 *24 *365}
