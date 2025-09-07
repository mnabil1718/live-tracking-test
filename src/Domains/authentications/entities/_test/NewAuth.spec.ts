import { NewAuth, NewAuthPayload } from '../NewAuth';

describe('NewAuth entities', () => {
  it('should throw error when payload not contain needed property', () => {
    // Arrange
    const payload: Partial<NewAuthPayload> = {
      accessToken: 'accessToken',
    };

    // Action & Assert
    expect(() => new NewAuth(payload as NewAuthPayload)).toThrow(
      'NEW_AUTH.NOT_CONTAIN_NEEDED_PROPERTY',
    );
  });

  it('should throw error when payload not meet data type specification', () => {
    // Arrange
    const payload = {
      accessToken: 'accessToken',
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      refreshToken: 1234 as any,
    };

    // Action & Assert
    expect(() => new NewAuth(payload as NewAuthPayload)).toThrow(
      'NEW_AUTH.NOT_MEET_DATA_TYPE_SPECIFICATION',
    );
  });

  it('should create NewAuth entities correctly', () => {
    // Arrange
    const payload = {
      accessToken: 'accessToken',
      refreshToken: 'refreshToken',
    };

    // Action
    const newAuth = new NewAuth(payload);

    // Assert
    expect(newAuth).toBeInstanceOf(NewAuth);
    expect(newAuth.accessToken).toEqual(payload.accessToken);
    expect(newAuth.refreshToken).toEqual(payload.refreshToken);
  });
});
