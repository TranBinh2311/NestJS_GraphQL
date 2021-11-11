import { Injectable, NotFoundException, Logger, BadRequestException, ExceptionFilter, HttpException, ArgumentsHost } from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '.prisma/client';
import { Appointment } from '../appointment/entities/appointment.entity';
import { LoggerService } from '../logger/logger.service';
import { IsEmail } from 'class-validator';
import * as jwt from 'jsonwebtoken'
import { UserLoginInput } from './dto/login.dto';
import { PasswordService } from '../auth/password.service';
import { Response, Request } from 'express';


@Injectable()
export class UsersService{
  constructor(private prisma: PrismaService) {}
    private readonly logger: LoggerService = new Logger(UsersService.name);
    // private mess = "";
    // private errorResponse = {
    //     code: "",
    //     timestamp: new Date().toLocaleDateString(),
    //     path: "",
    //     method: "",
    //     message: this.mess || null,
    //   };

    // Create a new
    async createUser(input: CreateUserInput): Promise<User> {
        const user = await this.prisma.user.findUnique({
            where: {
                email: input.email,
            },
        });

        if (user) {
            this.logger.warn(`${input.email} have been exist in system !!!`);
            throw new BadRequestException(`${input.email} have been exist in system !!!`);
        }
 
        const user_created = await this.prisma.user.create({
            data: input
        });

        this.logger.log(`CREATED successfull ${user_created.email}  !!!`);

        return user_created;
    }

    // Get a single user
    async user(id: string): Promise<User> {
        const user = await this.prisma.user.findUnique({
            where: { id },
            include: {
                appointments: true,
            },
        });
        if (!user) {
            this.logger.warn(`The user which have id('${id}')is not exist in system !!!`);
            throw new NotFoundException(`The user which have id('${id}') is not exist in system !!!`);
        }
        this.logger.log(`U have been get all information about user: ${user.email} `);
        return user;
    }

    // Get multiple users
    async users(): Promise<User[]> {    
        const all_User =  await this.prisma.user.findMany({
            include: {
                appointments: true,
            },
        });
        this.logger.log(`U have been get all User`);
        return all_User
    }

    // Update a user
    async updateUser(id : string, params: UpdateUserInput): Promise<User> {
        const userExist = await this.prisma.user.findUnique({ where: { id } });

        if (!userExist) {
            this.logger.warn(`${params.first_name} is invalid `);
            throw new NotFoundException(`${params.first_name} is invalid`);
        }
        
        const user_updated = await this.prisma.user.update({
            where: {id},
            data: { ...params },
        });
        this.logger.log(` U have been UPDATE informations about ${user_updated.email} successfully `);
        return user_updated;

    }

    // delete an user
    async deleteUser(id: string){
        const userExist = await this.prisma.user.findUnique({ where: { id } });

        if (!userExist) {
            this.logger.warn(`The user which have id('${id}') is invalid `);
            throw new NotFoundException(`The user which have id('${id}') is invalid`);
        }

        const user_deleted =  await this.prisma.user.delete({
            where: { id },
        });
        
        this.logger.log(`U have been DELETE all informations about ${user_deleted.email} successfully`);
        return user_deleted;
    }

    async createToken({id, email, first_name, last_name , role}) {
        return jwt.sign( {id, email, first_name, last_name , role}, process.env.JWT_SECRET , {expiresIn: process.env.JWT_EXPIRE});
    }

    async login(input: UserLoginInput) {
        const userExist = await this.prisma.user.findUnique({ where: { email: input.email } });        
        if (!userExist) {
            this.logger.warn(`'Email or Password is invalid'`);
            throw new NotFoundException(`'Email or Password is invalid'`);
        }

        const compare_password =  (userExist.password === input.password)
        if( compare_password === false )
        {
            this.logger.warn(`${'Email or Password is invalid'}`);
            throw new NotFoundException(`${'Email or Password is invalid'}`);
        }
        const {id, email, first_name, last_name , role} = userExist
        this.logger.log(`${'Login sucessfully'}`);
        return this.createToken({id, email, first_name, last_name , role});
    }
}
