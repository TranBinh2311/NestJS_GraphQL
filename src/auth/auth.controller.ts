import { Body, Controller, Logger, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { LoggerService } from 'src/logger/logger.service';
import { AuthService } from './auth.service';
import { LoginAdminDto } from './dto/loginAdmin.dto';

@Controller('auth')
@ApiTags('Authenticate')
export class AuthController {
    constructor(private readonly authService: AuthService) {}
    private readonly logger: LoggerService = new Logger(
        AuthController.name,
    );

    @Post('signUp')
    // @ApiOkResponse({ type: createApptDTO, description: 'OK', isArray: true })
    async signUpAccount(@Body() input: LoginAdminDto) {
        this.logger.verbose(
            `Create new account: ${JSON.stringify(input)}`,
        );
        return this.authService.signUp(input);
    }

    @Post('login')
    // @ApiOkResponse({ type: createApptDTO, description: 'OK', isArray: true })
    async login(@Body() input: LoginAdminDto) {
        this.logger.verbose(
            `login with account: ${JSON.stringify(input)}`,
        );
        return this.authService.login(input);
    }
}
