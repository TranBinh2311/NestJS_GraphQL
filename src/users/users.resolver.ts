import {
  Resolver,
  Query,
  Mutation,
  Args,
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
import { UseGuards, UsePipes, NotFoundException, Logger } from '@nestjs/common';
import { ValidationPipe } from '../middleware_logger/validation.pipe';
import { UserLoginInput } from './dto/login.dto';
import { AuthGaurd } from '../auth/auth.gaurd';
import MyContext  from '../types/myContext';
import { LoggerService } from '../logger/logger.service';
import { log_form } from '../middleware_logger/log_form';



@Resolver(() => User)
export class UsersResolver {
  constructor(
    private readonly usersService: UsersService,
    private prisma: PrismaService,
  ) {}
  private readonly logger: LoggerService = new Logger(UsersResolver.name);
  
  @Query(() => User, { nullable: true })
  async me(@Context() context: MyContext) {
    if(context.req.user === undefined) {
      this.logger.error(
        log_form(
          'me',
          `User have not logged in `,
          new Date().toDateString(),
        ),
      );
      throw new NotFoundException(`You must be logged in to system `);
    }
    return context.req.user;
  }


  @Query(() => [User], { name: 'findAllUser' })
  async findAll() {
    return this.usersService.users();
  }

  @Query(() => User, { name: 'getUserByID' })
  async findById(@Context() context: MyContext) {
    if(context.req.user === undefined) {
      this.logger.error(
        log_form(
          'getUserByID',
          `User have not logged in `,
          new Date().toDateString(),
        ),
      );
      throw new NotFoundException(`You must be logged in to system `);
    }
    return this.usersService.user(context.req.user.id);
  }

  @Mutation(() => User, { name: 'createUser' })
  @UsePipes(new ValidationPipe(UsersResolver))
  async create(@Args('input') args: CreateUserInput) {
    return this.usersService.createUser(args);
  }

  @Mutation(() => User, { name: 'updateUser' })
  @UsePipes(new ValidationPipe(UsersResolver))
  async update(@Context() context: MyContext, @Args('input') args: UpdateUserInput) {
    if(context.req.user === undefined) {
      this.logger.error(
        log_form(
          'updateUser',
          `User have not logged in `,
          new Date().toDateString(),
        ),
      );
      throw new NotFoundException(`You must be logged in to system `);
    }
    return this.usersService.updateUser(context.req.user.id, args);
  }

  @Mutation(() => User, { name: 'deleteUser' })
  @UsePipes(new ValidationPipe(UsersResolver))
  async delete(@Context() context: MyContext) {
    if(context.req.user === undefined) {
      this.logger.error(
        log_form(
          'delete',
          `User have not logged in `,
          new Date().toDateString(),
        ),
      );
      throw new NotFoundException(`You must be logged in to system `);
    }
    return this.usersService.deleteUser(context);
  }

  @ResolveField(() => Appt, { nullable: true })
  async appointments(@Parent() user: User) {
    return this.prisma.user
      .findUnique({ where: { id: user.id } })
      .appointments();
  }

  @Mutation(()=> String, { name: 'login' })
  async login(
    @Args('input') agrs: UserLoginInput,
    @Context() ctx: MyContext
  )
  {
    return this.usersService.login(agrs, ctx);
  }

  @Mutation(()=>Boolean, {name: 'logout', nullable: true})
  async logout(@Context() ctx: MyContext) {
    return this.usersService.logout(ctx);
  }
}
