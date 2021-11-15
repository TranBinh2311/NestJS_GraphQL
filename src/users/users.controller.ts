import { Controller, Get, Param, Response } from '@nestjs/common';
import { Response as Res } from 'express';
import { UsersService } from './users.service';


@Controller('user')
export class UsersController {
    constructor(private  usersService: UsersService){}
    @Get('/confirm/:id')
    
    confirmEmai(@Param('id') id:string, @Response() res: Res ) {
        return this.usersService.confirmEmai(id , res)
    }
}
