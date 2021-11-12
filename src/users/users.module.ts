import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';
import { PrismaService } from '../prisma/prisma.service';
import { PasswordService } from '../auth/password.service';
import { UsersController } from './users.controller';

@Module({
  providers: [UsersResolver, UsersService, PrismaService, PasswordService],
  controllers: [UsersController]
})
export class UsersModule {}
