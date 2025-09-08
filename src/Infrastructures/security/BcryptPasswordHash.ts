import bcryptmodule from 'bcrypt';
import { PasswordHash } from 'src/Applications/security/PasswordHash';
import AuthenticationError from 'src/Commons/exceptions/AuthenticationError';

class BcryptPasswordHash implements PasswordHash {
  constructor(
    private bcrypt: typeof bcryptmodule,
    private saltRound: number = 10,
  ) {}

  async hash(password: string): Promise<string> {
    return this.bcrypt.hash(password, this.saltRound);
  }

  async comparePassword(
    password: string,
    hashedPassword: string,
  ): Promise<void> {
    const result = await this.bcrypt.compare(password, hashedPassword);

    if (!result) {
      throw new AuthenticationError('kredensial yang Anda masukkan salah');
    }
  }
}

export default BcryptPasswordHash;
