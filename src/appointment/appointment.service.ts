import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateAppointmentInput } from './dto/create-appointment.input';
import { UpdateAppointmentInput } from './dto/update-appointment.input';
import { PrismaService } from '../prisma/prisma.service';
import { LoggerService } from '../logger/logger.service';
import { getApptsDTO } from './dto/get_app.dto';

@Injectable()
export class AppointmentService {
  constructor(private prisma: PrismaService) {}
  private readonly logger: LoggerService = new Logger(AppointmentService.name);
  private mess = '';

  // Get a single appointment

  async appointment(id: string) {
    this.mess = 'Tried to access an appointment that does not exist';
    const appt = await this.prisma.appointment.findUnique({
      where: { id },
      include: {
        user: true,
      },
    });

    if (!appt) {
      this.logger.warn(`${this.mess}`);
      throw new NotFoundException(`${this.mess}`);
    }
    return appt;
  }

  async appointments() {
    return (
      await this,
      this.prisma.appointment.findMany({
        include: {
          user: true,
        },
      })
    );
  }

  //get list appointment by user
  async appointmentsByUser(filter: getApptsDTO) {
    this.mess = 'Tried to access an appointment that does not exist';
    const userExist = await this.prisma.user.findUnique({
      where: {
        id: filter.user_id,
      },
    });

    if (!userExist) {
      this.logger.warn(`${this.mess}`);
      throw new NotFoundException(`${this.mess}`);
    }

    const startDate = new Date(Date.parse(filter.timeFrom));
    const endDate = new Date(Date.parse(filter.timeTo));

    return await this.prisma.appointment.findMany({
      where: {
        AND: [
          { user_id: filter.user_id },
          {
            start_time: {
              gte: startDate,
              lte: endDate,
            },
          },
        ],
      },
      include: {
        user: true, // Return all fields
      },
    });
  }

  // Create an appointment
  async createAppt(input: CreateAppointmentInput) {
    this.mess = 'Tried to access an user that does not exist when creating app';
    const userExist = await this.prisma.user.findUnique({
      where: { id: input.user_id },
    });

    if (!userExist) {
      this.logger.warn(`${this.mess}`);
      throw new NotFoundException(`${this.mess}`);
    }
    // const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    return await this.prisma.appointment.create({
      data: input,
    });
  }

  // Update an appointment
  async updateAppt(id: string, params: UpdateAppointmentInput) {
    this.mess =
      'Tried to access an appointment that does not exist when updating acc';
    const appExist = await this.prisma.appointment.findUnique({
      where: { id },
    });

    if (!appExist) {
      this.logger.warn(`${this.mess}`);
      throw new NotFoundException(`${this.mess}`);
    }
    return await this.prisma.appointment.update({
      where: { id },
      data: { ...params },
    });
  }

  // delete an appointment
  async deleteAppt(id: string) {
    this.mess =
      'Tried to access an apponiment that does not exist when deleting user';
    const appExist = await this.prisma.appointment.findUnique({
      where: { id },
    });

    if (!appExist) {
      this.logger.warn(`${this.mess}`);
      throw new NotFoundException(`${this.mess}`);
    }
    return await this.prisma.appointment.delete({
      where: {
        id,
      },
    });
  }
}
