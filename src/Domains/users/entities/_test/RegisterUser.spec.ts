/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { RegisterUser, RegisterUserPayload } from '../RegisterUser';

describe('a RegisterUser entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload: Partial<RegisterUserPayload> = {
      username: 'abc',
      password: 'abc',
    };

    // Action and Assert
    expect(() => new RegisterUser(payload as RegisterUserPayload)).toThrow(
      'REGISTER_USER.NOT_CONTAIN_NEEDED_PROPERTY',
    );
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload: RegisterUserPayload = {
      username: 123 as any,
      fullname: true as any,
      password: 'abc',
    };

    // Action and Assert
    expect(() => new RegisterUser(payload)).toThrow(
      'REGISTER_USER.NOT_MEET_DATA_TYPE_SPECIFICATION',
    );
  });

  it('should throw error when username contains more than 50 character', () => {
    // Arrange
    const payload: RegisterUserPayload = {
      username: 'dicodingindonesiadicodingindonesiadicodingindonesiadicoding',
      fullname: 'Dicoding Indonesia',
      password: 'abc',
    };

    // Action and Assert
    expect(() => new RegisterUser(payload)).toThrow(
      'REGISTER_USER.USERNAME_LIMIT_CHAR',
    );
  });

  it('should throw error when username contains restricted character', () => {
    // Arrange
    const payload: RegisterUserPayload = {
      username: 'dico ding',
      fullname: 'dicoding',
      password: 'abc',
    };

    // Action and Assert
    expect(() => new RegisterUser(payload)).toThrow(
      'REGISTER_USER.USERNAME_CONTAIN_RESTRICTED_CHARACTER',
    );
  });

  it('should create registerUser object correctly', () => {
    // Arrange
    const payload: RegisterUserPayload = {
      username: 'dicoding',
      fullname: 'Dicoding Indonesia',
      password: 'abc',
    };

    // Action
    const { username, fullname, password } = new RegisterUser(payload);

    // Assert
    expect(username).toEqual(payload.username);
    expect(fullname).toEqual(payload.fullname);
    expect(password).toEqual(payload.password);
  });
});
