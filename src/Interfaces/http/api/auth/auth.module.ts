import { PrismaService } from 'src/Infrastructures/database/prisma/prisma.service';
import { AuthenticationsController } from './auth.controller';
import { USER_REPOSITORY } from 'src/Domains/users/UserRepository';
import UserRepositoryPrisma from 'src/Infrastructures/repository/UserRepositoryPrisma';
import { nanoid } from 'nanoid';
import { AUTHENTICATION_REPOSITORY } from 'src/Domains/authentications/AuthenticationRepository';
import AuthenticationRepositoryPrisma from 'src/Infrastructures/repository/AuthenticationRepositoryPrisma';
import { PASSWORD_HASH } from 'src/Applications/security/PasswordHash';
import BcryptPasswordHash from 'src/Infrastructures/security/BcryptPasswordHash';
import JwtTokenManager from 'src/Infrastructures/security/JwtTokenManager';
import { AUTHENTICATION_TOKEN_MANAGER } from 'src/Applications/security/AuthenticationTokenManager';
import { LoginUserUseCase } from 'src/Applications/use_case/LoginUserUseCase';
import { LogoutUserUseCase } from 'src/Applications/use_case/LogoutUserUseCase';
import { RefreshAuthenticationUseCase } from 'src/Applications/use_case/RefreshAuthenticationUseCase';
import { Module } from '@nestjs/common';

@Module({
  controllers: [AuthenticationsController],
  providers: [
    PrismaService,
    {
      provide: USER_REPOSITORY,
      useFactory: (prisma: PrismaService) => {
        return new UserRepositoryPrisma(prisma, () => nanoid(10));
      },
      inject: [PrismaService],
    },
    {
      provide: AUTHENTICATION_REPOSITORY,
      useClass: AuthenticationRepositoryPrisma,
    },
    { provide: PASSWORD_HASH, useClass: BcryptPasswordHash },
    { provide: AUTHENTICATION_TOKEN_MANAGER, useClass: JwtTokenManager },
    LoginUserUseCase,
    LogoutUserUseCase,
    RefreshAuthenticationUseCase,
  ],
})
export class AuthModule {}
