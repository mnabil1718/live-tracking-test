/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { LogoutUserUseCase } from '../LogoutUserUseCase';
import { AuthenticationRepository } from '../../../Domains/authentications/AuthenticationRepository';

describe('LogoutUserUseCase', () => {
  it('should throw error if use case payload not contain refresh token', async () => {
    // Arrange
    const useCasePayload = {} as unknown as { refreshToken: string };
    const mockAuthenticationRepository: Partial<AuthenticationRepository> = {};
    const logoutUserUseCase = new LogoutUserUseCase(
      mockAuthenticationRepository as AuthenticationRepository,
    );

    // Action & Assert
    await expect(logoutUserUseCase.execute(useCasePayload)).rejects.toThrow(
      'DELETE_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN',
    );
  });

  it('should throw error if refresh token not string', async () => {
    // Arrange
    const useCasePayload = {
      refreshToken: 123 as any,
    };
    const mockAuthenticationRepository: Partial<AuthenticationRepository> = {};
    const logoutUserUseCase = new LogoutUserUseCase(
      mockAuthenticationRepository as AuthenticationRepository,
    );

    // Action & Assert
    await expect(logoutUserUseCase.execute(useCasePayload)).rejects.toThrow(
      'DELETE_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION',
    );
  });

  it('should orchestrate the delete authentication action correctly', async () => {
    // Arrange
    const useCasePayload = {
      refreshToken: 'refreshToken',
    };

    const mockAuthenticationRepository: jest.Mocked<
      Partial<AuthenticationRepository>
    > = {
      checkAvailabilityToken: jest.fn().mockResolvedValue(undefined),
      deleteToken: jest.fn().mockResolvedValue(undefined),
    };

    const logoutUserUseCase = new LogoutUserUseCase(
      mockAuthenticationRepository as AuthenticationRepository,
    );

    // Act
    await logoutUserUseCase.execute(useCasePayload);

    // Assert
    expect(
      mockAuthenticationRepository.checkAvailabilityToken,
    ).toHaveBeenCalledWith(useCasePayload.refreshToken);

    expect(mockAuthenticationRepository.deleteToken).toHaveBeenCalledWith(
      useCasePayload.refreshToken,
    );
  });
});
