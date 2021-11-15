import { Resolver, Query, Mutation, Args, Int, Parent, ResolveField, Context } from '@nestjs/graphql';
import { AppointmentService } from './appointment.service';
import { Appt } from '../model/appointment.model';
import { CreateAppointmentInput } from './dto/create-appointment.input';
import { UpdateAppointmentInput } from './dto/update-appointment.input';
import { getApptsDTO } from './dto/get-app.dto';
import { User } from '../model/user.model';
import { PrismaService } from '../prisma/prisma.service';
import { UsePipes, NotFoundException, Logger } from '@nestjs/common';
import { ValidationPipe } from 'src/middleware_logger/validation.pipe';
import MyContext  from '../types/myContext';
import { LoggerService } from '../logger/logger.service';
import { log_form } from '../middleware_logger/log_form';


@Resolver(() => Appt)
export class AppointmentResolver {
  constructor(private readonly apptService: AppointmentService,
    private prisma: PrismaService) {}
    private readonly logger: LoggerService = new Logger(AppointmentResolver.name);


  @Query(() => Appt, { name: 'get_appointment_by_id' })
  // @UseGuards(new AuthGaurd())
  async appointment(@Context() context: MyContext, @Args('id') id: string) {
    return this.apptService.appointment(context.req.user, id);
  }

  @Query(() => [Appt], { name: 'all_appointments' })
  async appointments(@Context() context: MyContext) {
    if(context.req.user === undefined) {
      this.logger.error(
        log_form(
          'all_appointments',
          `User have not logged in `,
          new Date().toDateString(),
        ),
      );
      throw new NotFoundException(`You must be logged in to system `);
    }
    return this.apptService.appointments(context.req.user);
  }

  @Query(() => Appt, { name: 'appointmentsByUser' })
  @UsePipes(new ValidationPipe(AppointmentResolver))
  async appointmentsByUser(@Context() context: MyContext, @Args('input') input: getApptsDTO) {
    return this.apptService.appointmentsByUser(context.req.user, input);
  }

  
  @Mutation(() => Appt, { name: 'createAppt' })
  @UsePipes(new ValidationPipe(AppointmentResolver))
  async create(@Context() context: MyContext, @Args('input') input: CreateAppointmentInput) {
    if(context.req.user === undefined) {
      this.logger.error(
        log_form(
          'createAppt',
          `User have not logged in `,
          new Date().toDateString(),
        ),
      );
      throw new NotFoundException(`You must be logged in to system `);
    }
    return this.apptService.createAppt(context.req.user, input);
  }

  @Mutation(() => Appt, { name: 'updateAppt' })
  @UsePipes(new ValidationPipe(AppointmentResolver))
  async update(
    @Context() context: MyContext,
    @Args('id') id: string,
    @Args('input') args: UpdateAppointmentInput,
  ) {
    if(context.req.user === undefined) {
      this.logger.error(
        log_form(
          'updateAppt',
          `User have not logged in `,
          new Date().toDateString(),
        ),
      );
      throw new NotFoundException(`You must be logged in to system `);
    }
    return this.apptService.updateAppt(context.req.user ,id, args);
  }

  @Mutation(() => Appt, { name: 'deleteAppt' })
  @UsePipes(new ValidationPipe(AppointmentResolver))
  async delete(@Context() context: MyContext,@Args('id') id: string) {
    if(context.req.user === undefined) {
      this.logger.error(
        log_form(
          'deleteAppt',
          `User have not logged in `,
          new Date().toDateString(),
        ),
      );
      throw new NotFoundException(`You must be logged in to system `);
    }
    return this.apptService.deleteAppt(context.req.user,id);
  }

  @ResolveField(()=> User, {nullable: true})
    async user(@Parent() appointments : Appt ){
        return this.prisma.appointment.findUnique({where: {id: appointments.id}})
    }
}
