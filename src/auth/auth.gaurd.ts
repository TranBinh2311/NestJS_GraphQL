import { CanActivate, ExecutionContext, Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { GqlExecutionContext } from "@nestjs/graphql"
import { LoggerService } from '../logger/logger.service';
import * as jwt from 'jsonwebtoken';


@Injectable()
export class AuthGaurd implements CanActivate {
    private readonly logger: LoggerService = new Logger(AuthGaurd.name);

    async canActivate(context: ExecutionContext){
        const ctx = GqlExecutionContext.create(context).getContext();
        if( !ctx.headers.authorization ){
            return false;
        }
        ctx.user = await this.validateToken(ctx.headers.authorization)
        return true;
    }
    
    async validateToken(auth: string){
        if(auth.split(' ')[0] != 'Bearer'){
            this.logger.warn(`Invalid Token`);
            throw new UnauthorizedException(`Invalid Token`);
        }
        const token =  auth.split(' ')[1];
        
        try{
            return await jwt.verify(token, process.env.JWT_SECRET);
        }
        catch(err){
            this.logger.warn(`Invalid Token`);
            throw new UnauthorizedException(`Invalid Token`);
        }
    }
}
