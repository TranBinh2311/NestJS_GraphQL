import { Resolver, Query, Mutation, Args, Int, Parent, ResolveField, Context } from '@nestjs/graphql';
import { AppointmentService } from './appointment.service';
import { Appt } from '../model/appointment.model';
import { CreateAppointmentInput } from './dto/create-appointment.input';
import { UpdateAppointmentInput } from './dto/update-appointment.input';
import { getApptsDTO } from './dto/get-app.dto';
import { User } from '../model/user.model';
import { PrismaService } from '../prisma/prisma.service';
import { UseGuards, UsePipes } from '@nestjs/common';
import { ValidationPipe } from 'src/middleware_logger/validation.pipe';
import { AuthGaurd } from '../auth/auth.gaurd';
import { Appointment } from '@prisma/client';
import MyContext  from '../types/myContext';


@Resolver(() => Appt)
export class AppointmentResolver {
  constructor(private readonly apptService: AppointmentService,
    private prisma: PrismaService) {}

  @Query(() => Appt, { name: 'get_appointment_by_id' })
  // @UseGuards(new AuthGaurd())
  async appointment(@Context() context: MyContext, @Args('id') id: string) {
    return this.apptService.appointment(context.req.user, id);
  }

  // @Query(() => [Appt], { name: 'all_appointments' })
  // async appointments() {
  //   return this.apptService.appointments();
  // }

  @Query(() => Appt, { name: 'appointmentsByUser' })
  @UsePipes(new ValidationPipe(AppointmentResolver))
  async appointmentsByUser(@Context() context: MyContext, @Args('input') input: getApptsDTO) {
    return this.apptService.appointmentsByUser(context.req.user, input);
  }



  
  @Mutation(() => Appt, { name: 'createAppt' })
  @UsePipes(new ValidationPipe(AppointmentResolver))
  async create(@Context() context: MyContext, @Args('input') input: CreateAppointmentInput) {
    return this.apptService.createAppt(context.req.user, input);
  }

  @Mutation(() => Appt, { name: 'updateAppt' })
  @UsePipes(new ValidationPipe(AppointmentResolver))
  async update(
    @Context() context: MyContext,
    @Args('id') id: string,
    @Args('input') args: UpdateAppointmentInput,
  ) {
    return this.apptService.updateAppt(context.req.user ,id, args);
  }

  @Mutation(() => Appt, { name: 'deleteAppt' })
  @UsePipes(new ValidationPipe(AppointmentResolver))
  async delete(@Context() context: MyContext,@Args('id') id: string) {
    return this.apptService.deleteAppt(context.req.user,id);
  }

  @ResolveField(()=> User, {nullable: true})
    async user(@Parent() appointments : Appt ){
       console.log("Dang o day nay");    
        return this.prisma.appointment.findUnique({where: {id: appointments.id}})
    }
}
