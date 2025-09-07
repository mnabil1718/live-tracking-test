/* eslint-disable @typescript-eslint/unbound-method */
import { AddUserUseCase, AddUserUseCasePayload } from '../AddUserUseCase';
import { UserRepository } from 'src/Domains/users/UserRepository';
import { PasswordHash } from 'src/Applications/security/PasswordHash';
import { RegisterUser } from 'src/Domains/users/entities/RegisterUser';
import { RegisteredUser } from 'src/Domains/users/entities/RegisteredUser';

describe('AddUserUseCase', () => {
  it('should orchestrating the add user action correctly', async () => {
    // Arrange
    const useCasePayload: AddUserUseCasePayload = {
      username: 'dicoding',
      password: 'secret',
      fullname: 'Dicoding Indonesia',
    };

    const mockRegisteredUser = new RegisteredUser({
      id: 'user-123',
      username: useCasePayload.username,
      fullname: useCasePayload.fullname,
    });

    const mockUserRepository: UserRepository = {
      verifyAvailableUsername: jest.fn().mockResolvedValue(undefined),
      addUser: jest.fn().mockResolvedValue(mockRegisteredUser),
      getPasswordByUsername: jest.fn(),
      getIdByUsername: jest.fn(),
    };
    const mockPasswordHash: PasswordHash = {
      hash: jest.fn().mockResolvedValue('encrypted_password'),
      comparePassword: jest.fn().mockResolvedValue(true),
    };

    /** creating use case instance */
    const getUserUseCase = new AddUserUseCase(
      mockUserRepository,
      mockPasswordHash,
    );

    // Action
    const registeredUser = await getUserUseCase.execute(useCasePayload);

    // Assert
    expect(registeredUser).toStrictEqual(
      new RegisteredUser({
        id: 'user-123',
        username: useCasePayload.username,
        fullname: useCasePayload.fullname,
      }),
    );

    expect(mockUserRepository.verifyAvailableUsername).toHaveBeenCalledWith(
      useCasePayload.username,
    );
    expect(mockPasswordHash.hash).toHaveBeenCalledWith(useCasePayload.password);
    expect(mockUserRepository.addUser).toHaveBeenCalledWith(
      new RegisterUser({
        username: useCasePayload.username,
        password: 'encrypted_password',
        fullname: useCasePayload.fullname,
      }),
    );
  });
});
