import { Inject, Injectable } from '@nestjs/common';
import {
  AUTHENTICATION_REPOSITORY,
  type AuthenticationRepository,
} from 'src/Domains/authentications/AuthenticationRepository';

export interface LogoutUserUseCasePayload {
  refreshToken: string;
}

@Injectable()
export class LogoutUserUseCase {
  constructor(
    @Inject(AUTHENTICATION_REPOSITORY)
    private readonly authenticationRepository: AuthenticationRepository,
  ) {}

  async execute(useCasePayload: LogoutUserUseCasePayload): Promise<void> {
    this.validatePayload(useCasePayload);

    const { refreshToken } = useCasePayload;

    await this.authenticationRepository.checkAvailabilityToken(refreshToken);
    await this.authenticationRepository.deleteToken(refreshToken);
  }

  private validatePayload(payload: LogoutUserUseCasePayload): void {
    const { refreshToken } = payload;

    if (!refreshToken) {
      throw new Error(
        'DELETE_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN',
      );
    }

    if (typeof refreshToken !== 'string') {
      throw new Error(
        'DELETE_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION',
      );
    }
  }
}
