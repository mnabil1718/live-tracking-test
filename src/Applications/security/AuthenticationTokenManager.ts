export interface TokenPayload {
  id: string;
  username: string;
}

export const AUTHENTICATION_TOKEN_MANAGER = Symbol(
  'AUTHENTICATION_TOKEN_MANAGER',
);
export interface AuthenticationTokenManager {
  createRefreshToken(payload: TokenPayload): Promise<string>;
  createAccessToken(payload: TokenPayload): Promise<string>;
  verifyRefreshToken(token: string): Promise<void>;
  decodePayload(token: string): TokenPayload;
}
