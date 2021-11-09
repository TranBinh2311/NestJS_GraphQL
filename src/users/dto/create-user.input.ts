import { InputType, Int, Field } from '@nestjs/graphql';
import { IsEmail, IsString, IsNotEmpty, IsOptional, IsEnum, Validate, MinLength } from 'class-validator';
import { EnumUserRole } from './enum_role.dto';

@InputType()
export class CreateUserInput {
  @IsEmail()
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { nullable: false })
  readonly email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8, {message: "Password has at least 8 character"})
  @Field(() => String, { nullable: true }) 
  readonly password: string;

  @IsString()
  @Field(() => String, { nullable: true })
  @IsOptional() 
  readonly first_name?: string;

  @IsString()
  @Field(() => String, { nullable: true })
  @IsOptional() 
  readonly last_name?: string;

  @IsString()
  @Field(() => String, { nullable: true })
  @IsOptional() 
  readonly birthdate?: string;

  @IsEnum(EnumUserRole)
  @IsNotEmpty()
  @Field(() => String, { nullable: false })
  readonly role: EnumUserRole;
}
