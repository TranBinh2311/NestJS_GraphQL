import { Resolver, Query, Mutation, Args, Int, Parent, ResolveField } from '@nestjs/graphql';
import { AppointmentService } from './appointment.service';
import { Appt } from '../model/appointment.model';
import { CreateAppointmentInput } from './dto/create-appointment.input';
import { UpdateAppointmentInput } from './dto/update-appointment.input';
import { getApptsDTO } from './dto/get_app.dto';
import { User } from '../model/user.model';
import { PrismaService } from '../prisma/prisma.service';

@Resolver(() => Appt)
export class AppointmentResolver {
  constructor(private readonly apptService: AppointmentService,
    private prisma: PrismaService) {}

  @Query(() => Appt, { name: 'appointment' })
  async appointment(@Args('id') id: string) {
    return this.apptService.appointment(id);
  }

  @Query(() => [Appt], { name: 'appointments' })
  async appointments() {
    return this.apptService.appointments();
  }

  // @Query(() => Appt, { name: 'appointmentsByUser' })
  // // @UsePipes(new ValidationPipe())
  // async appointmentsByUser(@Args('filter') args: getApptsDTO) {
  //   return this.apptService.appointmentsByUser(args);
  // }

  @Mutation(() => Appt, { name: 'createAppt' })
  // @UsePipes(new ValidationPipe())
  async create(@Args('input') input: CreateAppointmentInput) {
    // const errors = checkValid.validate(input);
    // if (errors.length > 0) {
    //     throw new BadRequestException(errors);
    // }
    return this.apptService.createAppt(input);
  }

  @Mutation(() => Appt, { name: 'updateAppt' })
  async update(
    @Args('id') id: string,
    @Args('input') args: UpdateAppointmentInput,
  ) {
    return this.apptService.updateAppt(id, args);
  }

  @Mutation(() => Appt, { name: 'deleteAppt' })
  async delete(@Args('id') id: string) {
    return this.apptService.deleteAppt(id);
  }

  @ResolveField(()=> User, {nullable: true})
    async user(@Parent() appointments : Appt ){
       console.log("Dang o day nay");    
        return this.prisma.appointment.findUnique({where: {id: appointments.id}})
    }
}
