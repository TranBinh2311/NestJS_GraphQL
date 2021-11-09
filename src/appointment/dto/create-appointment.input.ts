import {
  IsString,
  IsNotEmpty,
  MaxLength,
  IsNumber,
  Length,
} from 'class-validator';
import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateAppointmentInput {
  @IsNotEmpty({ message: 'The user_id is empty' })
  @Field(() => String, { nullable: false })
  readonly user_id: string;

  @IsString({ message: 'The start_time  must be string' })
  @IsNotEmpty({ message: 'The start_time is empty' })
  @Field(() => String, { nullable: false }) 
  readonly start_time: string;

  @IsString({ message: 'The end_time must be string' })
  @IsNotEmpty({ message: 'The end_time is empty' })
  @Field(() => String, { nullable: false }) 
  readonly end_time: string;

  @IsString({ message: 'The time_zone must be string' })
  @IsNotEmpty({ message: 'The time_zone is empty' })
  @Field(() => String, { nullable: false }) 
  readonly time_zone: string;
}
