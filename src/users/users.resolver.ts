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
import { UseGuards, UsePipes, Logger } from '@nestjs/common';
import { ValidationPipe } from '../middleware_logger/validation.pipe';
import { UserLoginInput } from './dto/login.dto';
import { AuthGaurd } from '../auth/auth.gaurd';
import { MyContext } from '../types/myContext';


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
  @UseGuards(new AuthGaurd())
  async findById(@Context('user') user: User) {
    return this.usersService.user(user.id);
  }

  @Mutation(() => User, { name: 'createUser' })
  @UsePipes(new ValidationPipe(UsersResolver))
  async create(@Args('input') args: CreateUserInput) {
    return this.usersService.createUser(args);
  }

  @Mutation(() => User, { name: 'updateUser' })
  @UseGuards(new AuthGaurd())
  @UsePipes(new ValidationPipe(UsersResolver))
  async update(@Context('user') user: User, @Args('input') args: UpdateUserInput) {
    return this.usersService.updateUser(user.id, args);
  }

  @Mutation(() => User, { name: 'deleteUser' })
  @UseGuards(new AuthGaurd())
  @UsePipes(new ValidationPipe(UsersResolver))
  async delete(@Context('user') user: User) {
    return this.usersService.deleteUser(user.id);
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
    @Context('ctx') ctx: MyContext
  )
  {
    return this.usersService.login(agrs, ctx);
  }

  @Mutation(()=>Boolean, {nullable: true})
  async logout(@Context('ctx') ctx: MyContext) {
    return this.usersService.logout(ctx);
  }
}
