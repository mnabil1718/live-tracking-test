import { Injectable, Inject } from '@nestjs/common';
import {
  AUTHENTICATION_REPOSITORY,
  type AuthenticationRepository,
} from 'src/Domains/authentications/AuthenticationRepository';
import {
  AUTHENTICATION_TOKEN_MANAGER,
  type AuthenticationTokenManager,
} from 'src/Applications/security/AuthenticationTokenManager';

export interface RefreshAuthenticationUseCasePayload {
  refreshToken: string;
}

@Injectable()
export class RefreshAuthenticationUseCase {
  constructor(
    @Inject(AUTHENTICATION_REPOSITORY)
    private readonly authenticationRepository: AuthenticationRepository,
    @Inject(AUTHENTICATION_TOKEN_MANAGER)
    private readonly authenticationTokenManager: AuthenticationTokenManager,
  ) {}

  async execute(payload: RefreshAuthenticationUseCasePayload): Promise<string> {
    this.verifyPayload(payload);

    const { refreshToken } = payload;

    await this.authenticationTokenManager.verifyRefreshToken(refreshToken);
    await this.authenticationRepository.checkAvailabilityToken(refreshToken);

    const { username, id } =
      this.authenticationTokenManager.decodePayload(refreshToken);

    return this.authenticationTokenManager.createAccessToken({ username, id });
  }

  private verifyPayload(payload: RefreshAuthenticationUseCasePayload): void {
    const { refreshToken } = payload;

    if (!refreshToken) {
      throw new Error(
        'REFRESH_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN',
      );
    }

    if (typeof refreshToken !== 'string') {
      throw new Error(
        'REFRESH_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION',
      );
    }
  }
}
