import { JwtService } from '@nestjs/jwt';
import {
  AuthenticationTokenManager,
  TokenPayload,
} from 'src/Applications/security/AuthenticationTokenManager';
import config from 'src/Commons/config';
import InvariantError from 'src/Commons/exceptions/InvariantError';

class JwtTokenManager implements AuthenticationTokenManager {
  private _jwt: JwtService;

  constructor(jwt: JwtService) {
    this._jwt = jwt;
  }

  async createAccessToken(payload: TokenPayload): Promise<string> {
    return this._jwt.signAsync(payload, {
      secret: config.auth.accessTokenKey,
      expiresIn: config.auth.accessTokenAge,
    });
  }

  async createRefreshToken(payload: TokenPayload): Promise<string> {
    return this._jwt.signAsync(payload, {
      secret: config.auth.refreshTokenKey,
    });
  }

  async verifyRefreshToken(token: string): Promise<void> {
    try {
      await this._jwt.verifyAsync(token, {
        secret: config.auth.refreshTokenKey,
      });
    } catch {
      throw new InvariantError('Refresh token tidak valid');
    }
  }

  decodePayload(token: string): TokenPayload {
    return this._jwt.decode(token);
  }
}

export default JwtTokenManager;
