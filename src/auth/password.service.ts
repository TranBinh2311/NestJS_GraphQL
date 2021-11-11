import * as bcrypt from "bcrypt";

export class PasswordService {
    async hassPassword(password: string): Promise<String> {
        const salt =  await bcrypt.genSalt();
        return await bcrypt.hash(password,salt);
    }
}