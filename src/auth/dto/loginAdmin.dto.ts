import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginAdminDto {
    @IsNotEmpty() @IsString() username: string;
    @IsNotEmpty() @IsString() password: string;
}
