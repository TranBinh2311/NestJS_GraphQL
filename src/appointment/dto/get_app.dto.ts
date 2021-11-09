import { IsString, IsNumber } from 'class-validator';

export class getApptsDTO {
    @IsNumber()
    user_id: string;

    @IsString()
    timeFrom: string;

    @IsString()
    timeTo: string;
}
