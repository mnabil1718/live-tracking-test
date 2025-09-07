/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { RefreshAuthenticationUseCase } from '../RefreshAuthenticationUseCase';
import { type AuthenticationRepository } from 'src/Domains/authentications/AuthenticationRepository';
import { type AuthenticationTokenManager } from 'src/Applications/security/AuthenticationTokenManager';

describe('RefreshAuthenticationUseCase', () => {
  it('should throw error if use case payload not contain refresh token', async () => {
    // Arrange
    const useCasePayload = {} as any;
    const refreshAuthenticationUseCase = new RefreshAuthenticationUseCase(
      {} as AuthenticationRepository,
      {} as AuthenticationTokenManager,
    );

    // Act & Assert
    await expect(
      refreshAuthenticationUseCase.execute(useCasePayload),
    ).rejects.toThrow(
      'REFRESH_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN',
    );
  });

  it('should throw error if refresh token not string', async () => {
    // Arrange
    const useCasePayload = { refreshToken: 1 as any };
    const refreshAuthenticationUseCase = new RefreshAuthenticationUseCase(
      {} as AuthenticationRepository,
      {} as AuthenticationTokenManager,
    );

    // Act & Assert
    await expect(
      refreshAuthenticationUseCase.execute(useCasePayload),
    ).rejects.toThrow(
      'REFRESH_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION',
    );
  });

  it('should orchestrate the refresh authentication action correctly', async () => {
    // Arrange
    const useCasePayload = { refreshToken: 'some_refresh_token' };

    const mockAuthenticationRepository: jest.Mocked<
      Partial<AuthenticationRepository>
    > = {
      checkAvailabilityToken: jest.fn().mockResolvedValue(undefined),
    };

    const mockAuthenticationTokenManager: jest.Mocked<
      Partial<AuthenticationTokenManager>
    > = {
      verifyRefreshToken: jest.fn().mockResolvedValue(undefined),
      decodePayload: jest
        .fn()
        .mockReturnValue({ username: 'dicoding', id: 'user-123' }),
      createAccessToken: jest.fn().mockResolvedValue('some_new_access_token'),
    };

    const refreshAuthenticationUseCase = new RefreshAuthenticationUseCase(
      mockAuthenticationRepository as AuthenticationRepository,
      mockAuthenticationTokenManager as AuthenticationTokenManager,
    );

    // Act
    const accessToken =
      await refreshAuthenticationUseCase.execute(useCasePayload);

    // Assert
    expect(
      mockAuthenticationTokenManager.verifyRefreshToken,
    ).toHaveBeenCalledWith(useCasePayload.refreshToken);
    expect(
      mockAuthenticationRepository.checkAvailabilityToken,
    ).toHaveBeenCalledWith(useCasePayload.refreshToken);
    expect(mockAuthenticationTokenManager.decodePayload).toHaveBeenCalledWith(
      useCasePayload.refreshToken,
    );
    expect(
      mockAuthenticationTokenManager.createAccessToken,
    ).toHaveBeenCalledWith({
      username: 'dicoding',
      id: 'user-123',
    });
    expect(accessToken).toEqual('some_new_access_token');
  });
});
