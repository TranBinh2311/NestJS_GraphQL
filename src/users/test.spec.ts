import { UsersResolver } from './users.resolver';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma/prisma.service';
import { LoggerService } from '../logger/logger.service';
import { PasswordService } from '../auth/password.service';
import { Module, BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Role } from '.prisma/client';
import { CreateUserInput } from './dto/create-user.input';

const example: CreateUserInput = {
  email: 'a@gmail.com',
  password: '23111999',
  birthdate: '1999-11-23T00:00:00.000Z',
  role: Role[0],
};

describe('UserService', () => {
  let service: UsersService;
  let prismaSevice: PrismaService;
  let passwordService: PasswordService;
  let resolve: UsersResolver;

  beforeEach(async () => {
    // const module: TestingModule = await Test.createTestingModule({
    //   providers: [UsersService],
    // }).compile();
    // service = module.get<UsersService>(UsersService);
    passwordService = new PasswordService();
    prismaSevice = new PrismaService();
    service = new UsersService(prismaSevice, passwordService);
    resolve = new UsersResolver(service, prismaSevice);
    console.log('hi');
  });

  it('userService is defined', () => {
    expect(service).toBeDefined();
  });
  it('userResolve is defined', () => {
    expect(resolve).toBeDefined();
  });
  it('should return a list of users', async () => {
    const result = [
      {
        id: 'abcxyz',
        role: Role[0],
        email: 'abc@gmail.com',
        password: '23111999',
      },
    ];
    const spy = jest
      .spyOn(service, 'users')
      .mockImplementation((): any => result);

    expect(await resolve.findAll()).toEqual(result);
    expect(spy).toBeCalledTimes(1);
  });
  it('should throw error when creating an user', async () => {
    const createSpy = jest.spyOn(service, 'createUser');

    const findSpy = jest
      .spyOn(prismaSevice.user, 'findUnique')
      .mockImplementation((): any => new CreateUserInput()); // email is existing in system

    const returnSpy = jest
      .spyOn(prismaSevice.user, 'create')
      .mockImplementation((): any => {
        id: Date.now(), example;
      });

    try {
      await resolve.create(example);
    } catch (error) {
      expect(error).toBeInstanceOf(BadRequestException); // email is existing in system
    }

    expect(createSpy).toBeCalledTimes(1);
    expect(findSpy).toHaveBeenCalledTimes(1);
    expect(returnSpy).toBeCalledTimes(0);
    //the same: expect(prismaSevice.user.create).toBeCalledTimes(0);
  });
  it('should create an user successfull', async () => {
    const createSpy = jest.spyOn(service, 'createUser');

    const findSpy = jest
      .spyOn(prismaSevice.user, 'findUnique')
      .mockImplementation((): any => undefined);

    const returnSpy = jest
      .spyOn(prismaSevice.user, 'create')
      .mockImplementation((): any => {
        id: Date.now(), example;
      });

    try {
      await resolve.create(example);
    } catch (err) {
      //ßconsole.log(err);
      //expect(err).toBe(null);
    }

    expect(findSpy).toHaveBeenCalledTimes(1);
    expect(createSpy).toBeCalledTimes(1);
    expect(returnSpy).toBeCalledTimes(1);
  });
});
