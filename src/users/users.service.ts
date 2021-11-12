import {
  Injectable,
  NotFoundException,
  Logger,
  BadRequestException,
  ExceptionFilter,
  HttpException,
  ArgumentsHost,
} from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '.prisma/client';
import { LoggerService } from '../logger/logger.service';
import * as jwt from 'jsonwebtoken';
import { UserLoginInput } from './dto/login.dto';
import { Response, Request, response } from 'express';
import { sendEmail } from '../utils/sendEmail';
import { confirmEmailLink } from '../utils/confirmEmailLink';
import { redis } from '../redis';
import { PasswordService } from 'src/auth/password.service';
import * as bcrypt from 'bcrypt'
import { MyContext } from '../types/myContext';
import * as session from 'express-session';
import {CookieOptions} from 'express'

const cookieOptions : CookieOptions  = {
    domain: 'localhost',
    secure: false,
    sameSite: 'strict',
    httpOnly: true,
    path: '/'
}

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private passwordService: PasswordService,
  ) {}
  private readonly logger: LoggerService = new Logger(UsersService.name);

  // Create a new user
  async createUser(input: CreateUserInput): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: {
        email: input.email,
      },
    });

    if (user) {
      this.logger.warn(`${input.email} have been exist in system !!!`);
      throw new BadRequestException(
        `${input.email} have been exist in system !!!`,
      );
    }
    const hassPassword = await this.passwordService.hassPassword(input.password);
    /*--------------------------------------------------------------------------------*/
    const user_created = await this.prisma.user.create({
      data: {
        ...input,
        password: hassPassword,
      },
    });
    /*--------------------------------------------------------------------------------*/
    await sendEmail(input.email, await confirmEmailLink(user_created.id));
    /*--------------------------------------------------------------------------------*/
    if (user_created)
      this.logger.log(`CREATED successfull ${user_created.email}  !!!`);
    return user_created;
  }

  // Get a single user
  async user(id: string): Promise<User> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      this.logger.warn(
        `The user which have id('${id}')is not exist in system !!!`,
      );
      throw new NotFoundException(
        `The user which have id('${id}') is not exist in system !!!`,
      );
    } else {
    /*--------------------------------------------------------------------------------*/
      this.logger.log(
        `U have been get all information about user: ${user.email} `,
      );
    }
    return user;
  }

  // Get multiple users
  async users(): Promise<User[]> {
    const all_User = await this.prisma.user.findMany();
    if (all_User) this.logger.log(`U have been get all User`);
    return all_User;
  }

  // Update a user
  async updateUser(id: string, params: UpdateUserInput): Promise<User> {
    const userExist = await this.prisma.user.findUnique({ where: { id } });

    if (!userExist) {
      this.logger.warn(`${params.first_name} is invalid `);
      throw new NotFoundException(`${params.first_name} is invalid`);
    }

    const user_updated = await this.prisma.user.update({
      where: { id },
      data: { ...params },
    });
    if (user_updated)
      this.logger.log(
        ` U have been UPDATE informations about ${user_updated.email} successfully `,
      );
    return user_updated;
  }

  // delete an user
  async deleteUser(id: string) {
    const userExist = await this.prisma.user.findUnique({ where: { id } });

    if (!userExist) {
      this.logger.warn(`The user which have id('${id}') is invalid `);
      throw new NotFoundException(`The user which have id('${id}') is invalid`);
    }

    const user_deleted = await this.prisma.user.delete({
      where: { id },
    });

    if (user_deleted)
      this.logger.log(
        `U have been DELETE all informations about ${user_deleted.email} successfully`,
      );
    return user_deleted;
  }

  async createToken({ id, email, first_name, last_name, role }) {
    return jwt.sign(
      { id, email, first_name, last_name, role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE },
    );
  }

  async login(input: UserLoginInput, ctx: MyContext) {
    const userExist = await this.prisma.user.findUnique({
      where: { email: input.email },
    });
    if (!userExist) {
      this.logger.warn(`'Email is invalid'`);
      throw new NotFoundException(`'Email is invalid'`);
    }

    const compare_password = await bcrypt.compare(input.password, userExist.password)
    if (compare_password === false) {
      this.logger.warn(`${'Wrong Password'}`);
      throw new NotFoundException(`${'Wrong Password'}`);
    }

    if( userExist.confirmed === false)
    {
        this.logger.warn(`User must confirmed before log in`);

        throw new NotFoundException(`You must confirmed before log in`)
    }

    // req.session.cookie.secure.valueOf.name =  userExist.id;
    ctx.res.cookie('bitech', jwt , cookieOptions);

    const { id, email, first_name, last_name, role } = userExist;
    this.logger.log(`${'Login sucessfully'}`);
    return this.createToken({ id, email, first_name, last_name, role });
  }

  async logout(ctx: MyContext){
      await ctx.req.session.destroy( async (err)=>{
            console.log(err);
            return false;       
      })

      await ctx.res.clearCookie('bitech')
      return true;
  }

  async confirmEmai(id: string, res: Response) {
    const userId = await redis.get(id);
    if (!userId) {
      this.logger.error(`Not found userId in Redis`);
      throw new NotFoundException(`Not found userId in Redis`);
    }
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        confirmed: true,
      },
    });
    res.send('Ok');
  }
}
