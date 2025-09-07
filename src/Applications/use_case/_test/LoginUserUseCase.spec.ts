/* eslint-disable @typescript-eslint/unbound-method */
import { LoginUserUseCase } from 'src/Applications/use_case/LoginUserUseCase';
import { NewAuth } from 'src/Domains/authentications/entities/NewAuth';
import type { UserRepository } from 'src/Domains/users/UserRepository';
import type { AuthenticationRepository } from 'src/Domains/authentications/AuthenticationRepository';
import type { AuthenticationTokenManager } from 'src/Applications/security/AuthenticationTokenManager';
import type { PasswordHash } from 'src/Applications/security/PasswordHash';

describe('LoginUserUseCase', () => {
  it('should orchestrate the login action correctly', async () => {
    // Arrange
    const useCasePayload = {
      username: 'dicoding',
      password: 'secret',
    };

    const mockedAuthentication = new NewAuth({
      accessToken: 'access_token',
      refreshToken: 'refresh_token',
    });

    // Mock dependencies
    const mockUserRepository = {
      getPasswordByUsername: jest.fn().mockResolvedValue('encrypted_password'),
      getIdByUsername: jest.fn().mockResolvedValue('user-123'),
    } as Partial<jest.Mocked<UserRepository>> as jest.Mocked<UserRepository>;

    const mockAuthenticationRepository = {
      addToken: jest.fn().mockResolvedValue(undefined),
    } as Partial<
      jest.Mocked<AuthenticationRepository>
    > as jest.Mocked<AuthenticationRepository>;

    const mockAuthenticationTokenManager = {
      createAccessToken: jest
        .fn()
        .mockResolvedValue(mockedAuthentication.accessToken),
      createRefreshToken: jest
        .fn()
        .mockResolvedValue(mockedAuthentication.refreshToken),
    } as Partial<
      jest.Mocked<AuthenticationTokenManager>
    > as jest.Mocked<AuthenticationTokenManager>;

    const mockPasswordHash: jest.Mocked<PasswordHash> = {
      hash: jest.fn(),
      comparePassword: jest.fn().mockResolvedValue(true),
    };

    // Create use case instance with mocks
    const loginUserUseCase = new LoginUserUseCase(
      mockUserRepository,
      mockAuthenticationRepository,
      mockAuthenticationTokenManager,
      mockPasswordHash,
    );

    // Action
    const actualAuthentication = await loginUserUseCase.execute(useCasePayload);

    // Assert
    expect(actualAuthentication).toEqual(
      new NewAuth({
        accessToken: 'access_token',
        refreshToken: 'refresh_token',
      }),
    );
    expect(mockUserRepository.getPasswordByUsername).toHaveBeenCalledWith(
      'dicoding',
    );
    expect(mockPasswordHash.comparePassword).toHaveBeenCalledWith(
      'secret',
      'encrypted_password',
    );
    expect(mockUserRepository.getIdByUsername).toHaveBeenCalledWith('dicoding');
    expect(
      mockAuthenticationTokenManager.createAccessToken,
    ).toHaveBeenCalledWith({ username: 'dicoding', id: 'user-123' });
    expect(
      mockAuthenticationTokenManager.createRefreshToken,
    ).toHaveBeenCalledWith({ username: 'dicoding', id: 'user-123' });
    expect(mockAuthenticationRepository.addToken).toHaveBeenCalledWith(
      mockedAuthentication.refreshToken,
    );
  });
});
