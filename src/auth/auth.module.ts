import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { LoggerModule } from '../logger/logger.module';
import { JwtStrategy } from './strategy/jwt.strategy';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PRIVATE_KEY, PUBLIC_KEY } from '../utils/readKey';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
    imports: [
        PassportModule,
        LoggerModule,
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: () => {
                return {
                    privateKey: PRIVATE_KEY,
                    publicKey: PUBLIC_KEY,
                    signOptions: { expiresIn: '60s', algorithm: 'RS256' },
                };
            },
            inject: [ConfigService],
        }),
    ],
    providers: [AuthService, JwtStrategy, PrismaService],
    controllers: [AuthController],
})
export class AuthModule {}
