import {
  IsString,
  IsNotEmpty,
  MaxLength,
  IsNumber,
  Length,
  IsDate,
  IsDateString,
  IsISO8601,
} from 'class-validator';
import { InputType, Field } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';

@InputType()
export class CreateAppointmentInput {
  
  @IsString({ message: 'The start_time  must be string'})
  @IsISO8601({strict: true}, {message: "The start_time  must be ISO8601 format" } )
  @Field(() => String, { nullable: false }) 
  readonly start_time: string;

  @IsString({ message: 'The end_time must be string' })
  @IsISO8601({strict: true}, {message: "The end_time  must be ISO8601 format" } )
  @Field(() => String, { nullable: false }) 
  readonly end_time: string;

  @IsString({ message: 'The time_zone must be string' })
  @IsNotEmpty({ message: 'The time_zone is empty' })
  @Field(() => String, { nullable: false }) 
  readonly time_zone: string;
}
