import { Inject, Injectable } from '@nestjs/common';
import {
  type AuthenticationRepository,
  AUTHENTICATION_REPOSITORY,
} from 'src/Domains/authentications/AuthenticationRepository';
import {
  USER_REPOSITORY,
  type UserRepository,
} from 'src/Domains/users/UserRepository';
import {
  AUTHENTICATION_TOKEN_MANAGER,
  type AuthenticationTokenManager,
} from '../security/AuthenticationTokenManager';
import { PASSWORD_HASH, type PasswordHash } from '../security/PasswordHash';
import { UserLogin } from 'src/Domains/users/entities/UserLogin';
import { NewAuth } from 'src/Domains/authentications/entities/NewAuth';

export interface LoginUserUseCasePayload {
  username: string;
  password: string;
}

@Injectable()
export class LoginUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: UserRepository,
    @Inject(AUTHENTICATION_REPOSITORY)
    private readonly authenticationRepository: AuthenticationRepository,
    @Inject(AUTHENTICATION_TOKEN_MANAGER)
    private readonly authenticationTokenManager: AuthenticationTokenManager,
    @Inject(PASSWORD_HASH) private readonly passwordHash: PasswordHash,
  ) {}

  async execute(useCasePayload: LoginUserUseCasePayload) {
    const { username, password } = new UserLogin(useCasePayload);

    const encryptedPassword =
      await this.userRepository.getPasswordByUsername(username);

    await this.passwordHash.comparePassword(password, encryptedPassword);

    const id = await this.userRepository.getIdByUsername(username);

    const accessToken = await this.authenticationTokenManager.createAccessToken(
      {
        username,
        id,
      },
    );

    const refreshToken =
      await this.authenticationTokenManager.createRefreshToken({
        username,
        id,
      });

    const newAuthentication = new NewAuth({
      accessToken,
      refreshToken,
    });

    await this.authenticationRepository.addToken(
      newAuthentication.refreshToken,
    );

    return newAuthentication;
  }
}
