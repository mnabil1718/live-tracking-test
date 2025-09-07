import bcryptmodule from 'bcrypt';
import { PasswordHash } from 'src/Applications/security/PasswordHash';
import AuthenticationError from 'src/Commons/exceptions/AuthenticationError';

class BcryptPasswordHash implements PasswordHash {
  private _bcrypt: typeof bcryptmodule;
  private _saltRound: number;

  constructor(bcrypt: typeof bcryptmodule, saltRound: number = 10) {
    this._bcrypt = bcrypt;
    this._saltRound = saltRound;
  }

  async hash(password: string): Promise<string> {
    return this._bcrypt.hash(password, this._saltRound);
  }

  async comparePassword(
    password: string,
    hashedPassword: string,
  ): Promise<void> {
    const result = await this._bcrypt.compare(password, hashedPassword);

    if (!result) {
      throw new AuthenticationError('kredensial yang Anda masukkan salah');
    }
  }
}

export default BcryptPasswordHash;
