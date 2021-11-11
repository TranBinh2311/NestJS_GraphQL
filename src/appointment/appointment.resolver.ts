import { Resolver, Query, Mutation, Args, Int, Parent, ResolveField, Context } from '@nestjs/graphql';
import { AppointmentService } from './appointment.service';
import { Appt } from '../model/appointment.model';
import { CreateAppointmentInput } from './dto/create-appointment.input';
import { UpdateAppointmentInput } from './dto/update-appointment.input';
import { getApptsDTO } from './dto/get_app.dto';
import { User } from '../model/user.model';
import { PrismaService } from '../prisma/prisma.service';
import { UseGuards, UsePipes } from '@nestjs/common';
import { ValidationPipe } from 'src/middleware_logger/validation.pipe';
import { AuthGaurd } from '../auth/auth.gaurd';


@Resolver(() => Appt)
export class AppointmentResolver {
  constructor(private readonly apptService: AppointmentService,
    private prisma: PrismaService) {}

  @Query(() => Appt, { name: 'get_appointment_by_id' })
  @UseGuards(new AuthGaurd())
  async appointment(@Context('user') user: User, @Args('id') id: string) {
    return this.apptService.appointment(user, id);
  }

  @Query(() => [Appt], { name: 'all_appointments' })
  async appointments() {
    return this.apptService.appointments();
  }

  // @Query(() => Appt, { name: 'appointmentsByUser' })
  // // @UsePipes(new ValidationPipe())
  // async appointmentsByUser(@Args('filter') args: getApptsDTO) {
  //   return this.apptService.appointmentsByUser(args);
  // }

  @Mutation(() => Appt, { name: 'createAppt' })
  @UseGuards(new AuthGaurd())
  @UsePipes(new ValidationPipe(AppointmentResolver))
  async create(@Context('user') user: User, @Args('input') input: CreateAppointmentInput) {
    
    return this.apptService.createAppt(user, input);
  }

  @Mutation(() => Appt, { name: 'updateAppt' })
  @UseGuards(new AuthGaurd())
  @UsePipes(new ValidationPipe(AppointmentResolver))
  async update(
    @Context('user') user: User,
    @Args('id') id: string,
    @Args('input') args: UpdateAppointmentInput,
  ) {
    return this.apptService.updateAppt(user, id, args);
  }

  @Mutation(() => Appt, { name: 'deleteAppt' })
  @UseGuards(new AuthGaurd())
  @UsePipes(new ValidationPipe(AppointmentResolver))
  async delete(@Context('user') user: User,@Args('id') id: string) {
    return this.apptService.deleteAppt(user,id);
  }

  @ResolveField(()=> User, {nullable: true})
    async user(@Parent() appointments : Appt ){
       console.log("Dang o day nay");    
        return this.prisma.appointment.findUnique({where: {id: appointments.id}})
    }
}
