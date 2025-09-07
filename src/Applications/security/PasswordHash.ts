export const PASSWORD_HASH = Symbol('PASSWORD_HASH');
export interface PasswordHash {
  hash(password: string): Promise<string>;
  comparePassword(plain: string, encrypted: string): Promise<void>;
}
