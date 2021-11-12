import { InputType, Int, Field } from '@nestjs/graphql';
import { IsEmail, IsString, IsNotEmpty, IsOptional, IsEnum, Validate, MinLength } from 'class-validator';
import { EnumUserRole } from './enum_role.dto';

@InputType()
export class CreateUserInput {
  @IsEmail()
  @IsString({message: "Email must be string"})
  @IsNotEmpty({message: "Email is not empty"})
  @Field(() => String, { nullable: false })
  readonly email: string;

  @IsString({message: "Password must be string"})
  @IsNotEmpty({message: "Password is not empty"})
  @MinLength(8, {message: "Password has at least 8 character"})
  @Field(() => String, { nullable: true }) 
  readonly password: string;

  @IsString({message: "first_name must be string"})
  @Field(() => String, { nullable: true })
  @IsOptional() 
  readonly first_name?: string;

  @IsString({message: "last_name must be string"})
  @Field(() => String, { nullable: true })
  @IsOptional() 
  readonly last_name?: string;

  @IsString({message: "Birthdate must be string"})
  @Field(() => String, { nullable: true })
  @IsOptional() 
  birthdate?: string;

  @IsEnum(EnumUserRole)
  @IsNotEmpty({message: "EnumUserRole is not empty"})
  @Field(() => String, { nullable: false })
  readonly role: EnumUserRole;
}
