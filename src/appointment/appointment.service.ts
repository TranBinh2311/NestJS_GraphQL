import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateAppointmentInput } from './dto/create-appointment.input';
import { UpdateAppointmentInput } from './dto/update-appointment.input';
import { PrismaService } from '../prisma/prisma.service';
import { LoggerService } from '../logger/logger.service';
import { getApptsDTO } from './dto/get-app.dto';
import { User } from '../model/user.model';

@Injectable()
export class AppointmentService {
  constructor(private prisma: PrismaService) {}
  private readonly logger: LoggerService = new Logger(AppointmentService.name);
  private mess = '';

  // Get a single appointment

  async appointment(user: User, id: string) {
    const appt = await this.prisma.appointment.findUnique({
      where: { id },
    });

    if (!appt) {
      this.logger.warn(`id('${id}') of appointment is invalid`);
      throw new NotFoundException(`id('${id}') of appointment is invalid`);
    }

    const checked = appt.user_id === user.id;
    if (checked === false) {
      this.logger.warn(`${user.email} don't have permisson`);
      throw new NotFoundException(`${user.email} don't have permisson`);
    }

    if (appt !== null && checked === true)
      this.logger.log(`Get information successfully`);

    return appt;
  }

  async appointments(user: User) {
    return (
      await this.prisma.appointment.findMany({
        where: {user_id: user.id},
        include: {
          user: true,
        },
      })
    );
  }

  //get list appointment by user
  async appointmentsByUser(user: User, filter: getApptsDTO) {
    const userExist = await this.prisma.user.findUnique({
      where: {
        id: filter.user_id,
      },
    });

    if (!userExist) {
      this.logger.warn(`id('${filter.user_id}') of appointment is invalid`);
      throw new NotFoundException(`id('${filter.user_id}') of appointment is invalid`);
    }

    const checked = (userExist.id === user.id);
    if (checked === false) {
      this.logger.warn(`${user.email} don't have permisson`);
      throw new NotFoundException(`${user.email} don't have permisson`);
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
  async createAppt(user: User, input: CreateAppointmentInput) {
    //input.user_id = user.id;
    if(!user){
        throw new NotFoundException(`Not Found ${user.email}`)
        this.logger.warn(`Not Found ${user.email}`);
    }

    const created_appt = await this.prisma.appointment.create({
      data: {
        ...input,
        user_id: user.id
      }
    });
    if (created_appt) this.logger.log(`Created Appointment Succesfully`);
    return created_appt;
  }

  // Update an appointment
  async updateAppt(user: User, id: string, params: UpdateAppointmentInput) {
    const appt = await this.prisma.appointment.findUnique({
      where: { id },
    });

    if (!appt) {
      this.logger.warn(`id('${id}') of appointment is invalid`);
      throw new NotFoundException(`id('${id}') of appointment is invalid`);
    }

    const checked = appt.user_id === user.id;
    if (checked === false) {
      this.logger.warn(`${user.email} don't have permisson`);
      throw new NotFoundException(`${user.email} don't have permisson`);
    }

    const updated_app = await this.prisma.appointment.update({
      where: { id },
      data: { ...params },
    });

    if (updated_app) this.logger.log(`Updated appoinment successfully`);

    return updated_app;
  }

  // delete an appointment
  async deleteAppt(user: User, id: string) {
    const appt = await this.prisma.appointment.findUnique({
      where: { id },
    });

    if (!appt) {
      this.logger.warn(`id('${id}') of appointment is invalid`);
      throw new NotFoundException(`id('${id}') of appointment is invalid`);
    }

    const checked = appt.user_id === user.id;
    if (checked === false) {
      this.logger.warn(`${user.email} don't have permisson`);
      throw new NotFoundException(`${user.email} don't have permisson`);
    }

    const deteled_app = await this.prisma.appointment.delete({
      where: {
        id,
      },
    });

    if (deteled_app) this.logger.log(`Deleted appoinment successfully`);

    return deteled_app;
  }
}
