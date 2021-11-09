import { Module } from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { AppointmentResolver } from './appointment.resolver';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  providers: [AppointmentResolver, AppointmentService, PrismaService]
})
export class AppointmentModule {}
