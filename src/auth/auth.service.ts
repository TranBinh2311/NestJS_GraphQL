import { BadRequestException, Injectable, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { User } from '@prisma/client';
import { LoginAdminDto } from './dto/loginAdmin.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { LoggerService } from './../logger/logger.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
    ) { }
    private readonly logger: LoggerService = new Logger(AuthService.name);

    async signUp(input: LoginAdminDto): Promise<User> {

        const accountExists = await this.prisma.user.findUnique({
            where: {
                username: input.username,
            },
        });

        if (accountExists) {
            this.logger.warn('Tried to create an account that already exists');
            throw new BadRequestException('account is already exist');
        }

        // Transform body into DTO
        const adminDTO = new LoginAdminDto();
        adminDTO.username = input.username;
        adminDTO.password = bcrypt.hashSync(input.password, 10);

        return this.prisma.admin.create({ data: adminDTO });
    }

    async login(acc: LoginAdminDto): Promise<Record<string, any>> {
        // Get user information
        const accDetails = await this.prisma.admin.findUnique({
            where: {
                username: acc.username,
            },
        });

        if (!accDetails){
            this.logger.warn('Tried to access account that does not exist');
            throw new NotFoundException('User with this username does not exist');
        }

        // Check if the given password match with saved password
        const isValid = bcrypt.compareSync(acc.password, accDetails.password);
        // console.log(isValid);
        if (isValid) {
            return {
                username: acc.username,
                access_token: this.jwtService.sign({
                    username: acc.username,
                }),
            };
        } else {
            throw new UnauthorizedException('Invalid credentials')
        }
    }
}
