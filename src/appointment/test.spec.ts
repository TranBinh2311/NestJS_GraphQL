// import { UsersResolver } from './users.resolver';
// import { UsersService } from './users.service'
import { PrismaService } from '../prisma/prisma.service'
import { LoggerService } from '../logger/logger.service'
import { Role, User } from "@prisma/client";
import { NotFoundException, INestApplication, BadRequestException } from '@nestjs/common';
import { PrismaClientValidationError, PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { Test, TestingModule } from '@nestjs/testing';
// import { CreateUserInput } from './dto/create-user.input';
import { create } from 'domain';


const example: CreateUserInput= {
    email: "tranbinh2311@gmail.com",
    password: "23111999",
    first_name: "Binh",
    last_name: "Tran",
    birthdate: "2000-12-01T00:00:00.000Z",
    role: Role[0]
}

describe('UserController', () => {

    let usersResolver: UsersResolver;
    let usersService: UsersService;
    let prismaService: PrismaService;

    beforeAll(() => console.log('Running test User controller'))

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UsersService,
                PrismaService,
                LoggerService
            ]
        }).compile();

        usersResolver = module.get<UsersResolver>(UsersResolver);
        usersService = module.get<UsersService>(UsersService);
        prismaService = module.get<PrismaService>(PrismaService);
    })

    // should return list of users
    it('should return list of users', async () => {
        const result = [{
            id: "1",
            email: "",
            firstName: "",
            lastName: "",
            birthdate: "",
            role: ""
        }]
        const spy = jest.spyOn(usersService, 'users').mockImplementation(async (): Promise<any> => result);
        expect(await usersResolver.findAll()).toBe(result);
        expect(spy).toBeCalledTimes(1);
    })

    //should throw error when user not found
    it('should throw error when user not found', async () => {
        // const result = new UserNotFoundException(1);
        const spy = jest.spyOn(usersService, 'user').mockImplementation(async (): Promise<any> => undefined);
        expect(spy).toBeCalledTimes(0);
        // expect(await usersController.findOneUser(1)).toBe(result);
    })

    it('should throw error when creating an already existing user', async () => {

        const createUserMock = jest.spyOn(usersService, 'createUser');
        const userExistMock = jest
            .spyOn(prismaService.user, 'findUnique')
            .mockImplementation((): any => new CreateUserInput())

        const returnUser = jest.spyOn(prismaService.user, 'create')
            .mockImplementation((): any => { example })

        try {
            await usersResolver.create(example);
        }
        catch (error) {
            expect(error).toBeInstanceOf(BadRequestException)
        }

        expect(createUserMock).toBeCalledTimes(1);
        expect(userExistMock).toHaveBeenCalledTimes(1);
        expect(returnUser).toBeCalledTimes(0);
    })

    // should be throw bad request exception when creating user with invalid data
    it('should be throw bad request exception when creating user with invalid data', async () => {
        const createUserMock = jest.spyOn(usersService, 'createUser');
        const userExistMock = jest
            .spyOn(prismaService.user, 'findUnique')
            .mockImplementation((): any => new CreateUserInput())

        const returnUser = jest.spyOn(prismaService.user, 'create')
            .mockImplementation((): any => { throw new BadRequestException() })

        try {
            await usersResolver.create(example);
        }
        catch (error) {
            expect(error).toBeInstanceOf(BadRequestException)
        }

        expect(createUserMock).toBeCalledTimes(1);
        expect(userExistMock).toHaveBeenCalledTimes(1);
        expect(returnUser).toBeCalledTimes(0);
    })

    // should throw not found exception when updating user that does not exist
    it('should throw not found exception when updating user that does not exist', async () => {
        const updateUserMock = jest.spyOn(usersService, 'updateUser');
        const userExistMock = jest
            .spyOn(prismaService.user, 'findUnique')
            .mockImplementation((): any => new CreateUserInput())

        const returnUser = jest.spyOn(prismaService.user, 'update')
            .mockImplementation((): any => undefined)

        try {
            await usersResolver.update("2311", example);
        }
        catch (error) {
            expect(error).toBeInstanceOf(NotFoundException)
        }

        expect(updateUserMock).toBeCalledTimes(1);
        expect(userExistMock).toHaveBeenCalledTimes(0);
        expect(returnUser).toBeCalledTimes(1);
    })

    it('should throw bad request when delete an user', async () => {

        const deleteSpy = jest.spyOn(usersService, 'deleteUser');
        const findSpy = jest.spyOn(prismaService.user, 'findUnique')
            .mockImplementation((): any => undefined)

        try {
            await usersResolver.delete("23");
        }
        catch (error) {
            expect(error).toBeInstanceOf(NotFoundException)
        }
        const deleteSuccessfullSpy = jest.spyOn(prismaService.user, 'delete')
            .mockImplementation((): any => undefined)

        expect(deleteSpy).toBeCalledTimes(1);
        expect(findSpy).toHaveBeenCalledTimes(1);
        expect(deleteSuccessfullSpy).toBeCalledTimes(0);
    })

})