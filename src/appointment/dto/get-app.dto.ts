import { Field, InputType } from '@nestjs/graphql';
import { IsString, IsNumber } from 'class-validator';

@InputType()
export class getApptsDTO {
    @Field()
    @IsString()
    user_id: string;

    @Field()
    @IsString()
    timeFrom: string;

    @Field()
    @IsString()
    timeTo: string;
}
