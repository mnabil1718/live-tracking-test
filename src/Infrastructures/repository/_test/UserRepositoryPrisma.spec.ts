import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'src/Infrastructures/database/prisma/prisma.service';
import { UsersTableTestHelper } from 'test/helpers/UsersTableTestHelper';
import UserRepositoryPrisma from 'src/Infrastructures/repository/UserRepositoryPrisma';
import InvariantError from 'src/Commons/exceptions/InvariantError';
import { RegisterUser } from 'src/Domains/users/entities/RegisterUser';
import { RegisteredUser } from 'src/Domains/users/entities/RegisteredUser';
import { nanoid } from 'nanoid';

describe('UserRepository Prisma', () => {
  let prisma: PrismaService;
  let usersHelper: ReturnType<typeof UsersTableTestHelper>;
  let userRepository: UserRepositoryPrisma;

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [PrismaService],
    }).compile();

    prisma = moduleRef.get<PrismaService>(PrismaService);
    await prisma.$connect();

    usersHelper = UsersTableTestHelper(prisma);
    userRepository = new UserRepositoryPrisma(prisma, nanoid);
  });

  afterEach(async () => {
    await usersHelper.cleanTable();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('verifyAvailableUsername function', () => {
    it('should throw InvariantError when username not available', async () => {
      await usersHelper.addUser({ username: 'dicoding' });

      await expect(
        userRepository.verifyAvailableUsername('dicoding'),
      ).rejects.toThrow(InvariantError);
    });

    it('should not throw InvariantError when username available', async () => {
      await expect(
        userRepository.verifyAvailableUsername('dicoding'),
      ).resolves.not.toThrow(InvariantError);
    });
  });

  describe('addUser function', () => {
    it('should persist register user and return registered user correctly', async () => {
      const registerUser = new RegisterUser({
        username: 'dicoding',
        password: 'secret_password',
        fullname: 'Dicoding Indonesia',
      });
      const fakeIdGenerator = () => '123';
      const repo = new UserRepositoryPrisma(prisma, fakeIdGenerator);

      const registeredUser = await repo.addUser(registerUser);

      const users = await usersHelper.findUsersById('user-123');
      expect(users).toHaveLength(1);
      expect(registeredUser).toStrictEqual(
        new RegisteredUser({
          id: 'user-123',
          username: 'dicoding',
          fullname: 'Dicoding Indonesia',
        }),
      );
    });
  });

  describe('getPasswordByUsername', () => {
    it('should throw InvariantError when user not found', async () => {
      await expect(
        userRepository.getPasswordByUsername('dicoding'),
      ).rejects.toThrow(InvariantError);
    });

    it('should return username password when user is found', async () => {
      await usersHelper.addUser({
        username: 'dicoding',
        password: 'secret_password',
      });

      const password = await userRepository.getPasswordByUsername('dicoding');
      expect(password).toBe('secret_password');
    });
  });

  describe('getIdByUsername', () => {
    it('should throw InvariantError when user not found', async () => {
      await expect(userRepository.getIdByUsername('dicoding')).rejects.toThrow(
        InvariantError,
      );
    });

    it('should return user id correctly', async () => {
      await usersHelper.addUser({ id: 'user-321', username: 'dicoding' });

      const userId = await userRepository.getIdByUsername('dicoding');
      expect(userId).toEqual('user-321');
    });
  });
});
