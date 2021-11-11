import {
    PipeTransform,
    Injectable,
    ArgumentMetadata,
    BadRequestException,
    Logger,
} from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { LoggerService } from '../logger/logger.service';

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
    constructor(private class_name : any ){}
    private readonly logger: LoggerService = new Logger(this.class_name.name);

    async transform(value: any, { metatype }: ArgumentMetadata) {
        if (value instanceof Object && this.isEmpty(value)) {
            throw new BadRequestException(
                'Validation body failed: No body submitted',
            );
        }
        if (!metatype || !this.toValidate(metatype)) {
            return value;
        }
        const object = plainToClass(metatype, value);
        const errors = await validate(object);
        if (errors.length > 0) {
            this.logger.error(
                `Validation input failed: ${this.formatErrors(errors)}`,
            );
            throw new BadRequestException(
                `Validation input failed: ${this.formatErrors(errors)}`,
            );
        }
        return value;
    }

    private toValidate(metatype: Function): boolean {
        const types: Function[] = [String, Boolean, Number, Array, Object];
        return !types.includes(metatype);
    }

    private formatErrors(errors: any[]) {
        return errors
            .map((err) => {
                for (const property in err.constraints) {
                    return err.constraints[property];
                }
            })
            .join(',  ');
    }

    private isEmpty(value: any) {
        if (Object.keys(value).length > 0) {
            return false;
        }
        return true;
    }

    // private check(errors: any[], message: string) {
    //     errors.map(err => {
    //         for (let property in err.constraints) {
    //             return err.constraints[property] = message;
    //         }
    //     })
    // }
}
