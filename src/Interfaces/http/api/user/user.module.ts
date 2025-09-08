import { Module } from '@nestjs/common';
import { UsersController } from './user.controller';
import { AddUserUseCase } from 'src/Applications/use_case/AddUserUseCase';
import { USER_REPOSITORY } from 'src/Domains/users/UserRepository';
import UserRepositoryPrisma from 'src/Infrastructures/repository/UserRepositoryPrisma';
import { PASSWORD_HASH } from 'src/Applications/security/PasswordHash';
import BcryptPasswordHash from 'src/Infrastructures/security/BcryptPasswordHash';
import { PrismaService } from 'src/Infrastructures/database/prisma/prisma.service';
import { nanoid } from 'nanoid';
import bcrypt from 'bcrypt';
import { PrismaModule } from 'src/Infrastructures/database/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [UsersController],
  providers: [
    AddUserUseCase,
    {
      provide: USER_REPOSITORY,
      useFactory: (prisma: PrismaService) => {
        const idGenerator = () => nanoid(10);
        return new UserRepositoryPrisma(prisma, idGenerator);
      },
      inject: [PrismaService],
    },
    {
      provide: PASSWORD_HASH,
      useFactory: () => {
        return new BcryptPasswordHash(bcrypt);
      },
    },
  ],
})
export class UserModule {}
