import {
  Resolver,
  Query,
  Mutation,
  Args,
  Int,
  Parent,
  ResolveField,
} from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from '../model/user.model';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { UserEntity } from '../decorators/user.decorator';
import { Appt } from '../model/appointment.model';
import { PrismaService } from '../prisma/prisma.service';

@Resolver(() => User)
export class UsersResolver {
  constructor(
    private readonly usersService: UsersService,
    private prisma: PrismaService,
  ) {}

  @Query(() => [User], { name: 'findAllUser' })
  async findAll() {
    return this.usersService.users();
  }

  @Query(() => User, { name: 'getUserByID' })
  async post(@Args('id') id: string) {
    return this.usersService.user(id);
  }

  @Mutation(() => User, { name: 'createUser' })
  async create(@Args('input') args: CreateUserInput) {
    return this.usersService.createUser(args);
  }

  @Mutation(() => User, { name: 'updateUser' })
  async update(@Args('id') id: string, @Args('input') args: UpdateUserInput) {
    return this.usersService.updateUser(id, args);
  }

  @Mutation(() => User, { name: 'deleteUser' })
  async delete(@Args('id') id: string) {
    return this.usersService.deleteUser(id);
  }

  @ResolveField(() => Appt, { nullable: true })
  async appointments(@Parent() user: User) {
    return this.prisma.user
      .findUnique({ where: { id: user.id } })
      .appointments();
  }
}
