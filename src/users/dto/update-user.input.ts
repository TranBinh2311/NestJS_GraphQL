import { CreateUserInput } from './create-user.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

@InputType()
export class UpdateUserInput {
  @Field(() => String, {
    nullable: true,
    description: undefined,
  })
  readonly first_name?: string;

  @Field(() => String, {
    nullable: true,
    description: undefined,
  })
  readonly last_name?: string;

  @Field(() => String, {
    nullable: true,
    description: undefined,
  })
  readonly birthdate?: string;
}
