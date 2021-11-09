import { Injectable, NotFoundException, Logger, BadRequestException } from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '.prisma/client';
import { Appointment } from '../appointment/entities/appointment.entity';
import { LoggerService } from '../logger/logger.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) { }
    private readonly logger: LoggerService = new Logger(UsersService.name);
    private mess = "";
    // Create a new
    async createUser(input: CreateUserInput): Promise<User> {
        this.mess = 'Tried to create an user that already exists';
        const user = await this.prisma.user.findUnique({
            where: {
                email: input.email,
            },
        });

        if (user) {
            this.logger.warn(`${this.mess}`);
            throw new BadRequestException(`${this.mess}`);
        }

        return await this.prisma.user.create({
            data: input,
            include: {
                appointments: true,
            },
            
        });
    }

    // Get a single user
    async user(id: string): Promise<User> {
        this.mess = 'Tried to access a user that does not exist'
        const user = await this.prisma.user.findUnique({
            where: { id },
            include: {
                appointments: true,
            },
        });

        if (!user) {
            this.logger.warn(`${this.mess}`);
            throw new NotFoundException(`${this.mess}`);
        }

        return user;
    }

    // Get multiple users
    async users(): Promise<User[]> {
        return await this.prisma.user.findMany({
            include: {
                appointments: true,
            },
        });
    }

    // Update a user
    async updateUser(id : string, params: UpdateUserInput): Promise<User> {
        this.mess = 'Tried to access an user that does not exist when updating acc';
        const userExist = await this.prisma.user.findUnique({ where: { id } });

        if (!userExist) {
            this.logger.warn(`${this.mess}`);
            throw new NotFoundException(`${this.mess}`);
        }
        return await this.prisma.user.update({
            where: {id},
            data: { ...params },
        });

    }

    // delete an user
    async deleteUser(id: string): Promise<User> {
        this.mess = 'Tried to access an user that does not exist when deleting acc';
        const userExist = await this.prisma.user.findUnique({ where: { id } });

        if (!userExist) {
            this.logger.warn(`${this.mess}`);
            throw new NotFoundException(`${this.mess}`);
        }

        return await this.prisma.user.delete({
            where: { id },
        });
    }


}
