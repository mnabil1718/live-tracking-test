/* eslint-disable @typescript-eslint/unbound-method */
import { JwtService } from '@nestjs/jwt';
import JwtTokenManager from '../JwtTokenManager';
import { TokenPayload } from 'src/Applications/security/AuthenticationTokenManager';
import config from 'src/Commons/config';
import InvariantError from 'src/Commons/exceptions/InvariantError';

describe('JwtTokenManager', () => {
  let jwtService: JwtService;
  let jwtTokenManager: JwtTokenManager;

  beforeEach(() => {
    // Mock JwtService
    jwtService = {
      signAsync: jest.fn().mockResolvedValue('mock_token'),
      verifyAsync: jest.fn(),
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      decode: jest.fn((token) => ({ username: 'dicoding' })),
    } as unknown as JwtService;

    jwtTokenManager = new JwtTokenManager(jwtService);
  });

  it('should create accessToken correctly', async () => {
    const payload: TokenPayload = { id: 'user-123', username: 'dicoding' };
    const token = await jwtTokenManager.createAccessToken(payload);

    expect(jwtService.signAsync).toHaveBeenCalledWith(payload, {
      secret: config.auth.accessTokenKey,
      expiresIn: config.auth.accessTokenAge,
    });
    expect(token).toBe('mock_token');
  });

  it('should create refreshToken correctly', async () => {
    const payload: TokenPayload = { username: 'dicoding' } as TokenPayload;
    const token = await jwtTokenManager.createRefreshToken(payload);

    expect(jwtService.signAsync).toHaveBeenCalledWith(payload, {
      secret: config.auth.refreshTokenKey,
    });
    expect(token).toBe('mock_token');
  });

  it('should throw InvariantError if refresh token verification fails', async () => {
    (jwtService.verifyAsync as jest.Mock).mockRejectedValueOnce(new Error());
    await expect(
      jwtTokenManager.verifyRefreshToken('invalid_token'),
    ).rejects.toThrow(InvariantError);
  });

  it('should not throw when refresh token verification succeeds', async () => {
    (jwtService.verifyAsync as jest.Mock).mockResolvedValueOnce(true);
    await expect(
      jwtTokenManager.verifyRefreshToken('valid_token'),
    ).resolves.not.toThrow();
  });

  it('should decode payload correctly', () => {
    const payload = jwtTokenManager.decodePayload('some_token');
    expect(payload.username).toBe('dicoding');
  });
});
