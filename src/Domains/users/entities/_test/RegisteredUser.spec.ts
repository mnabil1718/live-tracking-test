/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { RegisteredUser, RegisteredUserPayload } from '../RegisteredUser';

describe('a RegisteredUser entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload: Partial<RegisteredUserPayload> = {
      username: 'dicoding',
      fullname: 'Dicoding Indonesia',
    };

    // Action and Assert
    expect(() => new RegisteredUser(payload as RegisteredUserPayload)).toThrow(
      'REGISTERED_USER.NOT_CONTAIN_NEEDED_PROPERTY',
    );
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload: RegisteredUserPayload = {
      id: 123 as any,
      username: 'dicoding',
      fullname: {} as any,
    };

    // Action and Assert
    expect(() => new RegisteredUser(payload)).toThrow(
      'REGISTERED_USER.NOT_MEET_DATA_TYPE_SPECIFICATION',
    );
  });

  it('should create registeredUser object correctly', () => {
    // Arrange
    const payload: RegisteredUserPayload = {
      id: 'user-123',
      username: 'dicoding',
      fullname: 'Dicoding Indonesia',
    };

    // Action
    const registeredUser = new RegisteredUser(payload);

    // Assert
    expect(registeredUser.id).toEqual(payload.id);
    expect(registeredUser.username).toEqual(payload.username);
    expect(registeredUser.fullname).toEqual(payload.fullname);
  });
});
