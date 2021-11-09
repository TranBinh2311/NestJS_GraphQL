import {
  ObjectType,
  registerEnumType,
  HideField,
  Field,
} from '@nestjs/graphql';
import { Appt } from './appointment.model';
import { BaseModel } from './base.model';

export enum Role {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

registerEnumType(Role, {
  name: 'Role',
  description: 'User role',
});

@ObjectType()
export class User extends BaseModel {
  @Field(() => String, {
    nullable: false,
  })
  email: string;

  @Field(() => String, {
    nullable: true,
  })
  first_name?: string;

  @Field(() => String, {
    nullable: true,
  })
  last_name?: string;

  @Field(() => String, {
    nullable: false,
  })
  role: Role;

  @Field(() => [Appt], {
    nullable: true,
  })
  appointments: Appt[];

  @Field(() => String, {
    nullable: true,
  })
  @HideField()
  password: string;
}
