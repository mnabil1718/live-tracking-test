import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'src/Infrastructures/database/prisma/prisma.service';
import { AuthenticationsTableTestHelper } from 'test/helpers/AuthenticationsTableTestHelper';
import AuthenticationRepositoryPrisma from '../AuthenticationRepositoryPrisma';
import InvariantError from 'src/Commons/exceptions/InvariantError';

describe('AuthenticationRepository Prisma', () => {
  let prisma: PrismaService;
  let authHelper: ReturnType<typeof AuthenticationsTableTestHelper>;
  let authenticationRepository: AuthenticationRepositoryPrisma;

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [PrismaService],
    }).compile();

    prisma = moduleRef.get<PrismaService>(PrismaService);
    await prisma.$connect();

    authHelper = AuthenticationsTableTestHelper(prisma);
    authenticationRepository = new AuthenticationRepositoryPrisma(prisma);
  });

  afterEach(async () => {
    await authHelper.cleanTable();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('addToken function', () => {
    it('should add token to database', async () => {
      const token = 'token';

      await authenticationRepository.addToken(token);

      const tokens = await authHelper.findToken(token);
      expect(tokens).toHaveLength(1);
      expect(tokens[0].token).toBe(token);
    });
  });

  describe('checkAvailabilityToken function', () => {
    it('should throw InvariantError if token not available', async () => {
      const token = 'token';

      await expect(
        authenticationRepository.checkAvailabilityToken(token),
      ).rejects.toThrow(InvariantError);
    });

    it('should not throw InvariantError if token available', async () => {
      const token = 'token';
      await authHelper.addToken(token);

      await expect(
        authenticationRepository.checkAvailabilityToken(token),
      ).resolves.not.toThrow(InvariantError);
    });
  });

  describe('deleteToken function', () => {
    it('should delete token from database', async () => {
      const token = 'token';
      await authHelper.addToken(token);

      await authenticationRepository.deleteToken(token);

      const tokens = await authHelper.findToken(token);
      expect(tokens).toHaveLength(0);
    });
  });
});
