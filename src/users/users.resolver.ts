import {
  Resolver,
  Query,
  Mutation,
  Args,
  Int,
  Parent,
  ResolveField,
  Context,
} from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from '../model/user.model';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { Appt } from '../model/appointment.model';
import { PrismaService } from '../prisma/prisma.service';
import { Req, UseGuards, UsePipes } from '@nestjs/common';
import { ValidationPipe } from '../middleware_logger/validation.pipe';
import { UserLoginInput } from './dto/login.dto';
import { user_token } from '../../dist/users/interface/login.response';
import { AuthGaurd } from '../auth/auth.gaurd';
import { Request } from 'express';

@Resolver(() => User)
export class UsersResolver {
  constructor(
    private readonly usersService: UsersService,
    private prisma: PrismaService,
  ) {}

  
  @Query(()=>User, { name: 'who' } )
  @UseGuards(new AuthGaurd())
  async me(@Context('user') user: User){
    return user;
  }


  @Query(() => [User], { name: 'findAllUser' })
  async findAll() {
    return this.usersService.users();
  }

  @Query(() => User, { name: 'getUserByID' })
  @UsePipes(new ValidationPipe(UsersResolver))
  async post(@Args('id') id: string) {
    return this.usersService.user(id);
  }

  @Mutation(() => User, { name: 'createUser' })
  @UsePipes(new ValidationPipe(UsersResolver))
  async create(@Args('input') args: CreateUserInput) {
    return this.usersService.createUser(args);
  }

  @Mutation(() => User, { name: 'updateUser' })
  @UsePipes(new ValidationPipe(UsersResolver))
  async update(@Args('id') id: string, @Args('input') args: UpdateUserInput) {
    return this.usersService.updateUser(id, args);
  }

  @Mutation(() => User, { name: 'deleteUser' })
  @UsePipes(new ValidationPipe(UsersResolver))
  async delete(@Args('id') id: string) {
    return this.usersService.deleteUser(id);
  }

  @ResolveField(() => Appt, { nullable: true })
  async appointments(@Parent() user: User) {
    return this.prisma.user
      .findUnique({ where: { id: user.id } })
      .appointments();
  }

  @Mutation(()=> String, { name: 'login' })
  async login(@Args('input') agrs: UserLoginInput)
  {
    return this.usersService.login(agrs);
  }

 
}
