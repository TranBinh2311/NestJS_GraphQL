import { ObjectType, Field } from '@nestjs/graphql';
import { User } from './user.model';
import { BaseModel } from './base.model';

@ObjectType()
export class Appt extends BaseModel {
  @Field(() => String, {
    nullable: false,
  })
  start_time: Date;

  @Field(() => String, {
    nullable: false,
  })
  end_time: Date;

  @Field(() => String, {
    nullable: true,
  })
  time_zone: String;


  @Field(() => User, {
    nullable: true,
  })
  user: User;

  @Field(() => String, {
    nullable: true,
  })
  user_id: String;
}
