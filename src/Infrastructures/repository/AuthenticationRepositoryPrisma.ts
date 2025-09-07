import { AuthenticationRepository } from 'src/Domains/authentications/AuthenticationRepository';
import { PrismaService } from '../database/prisma/prisma.service';
import InvariantError from 'src/Commons/exceptions/InvariantError';
import { Injectable } from '@nestjs/common';

@Injectable()
class AuthenticationRepositoryPrisma implements AuthenticationRepository {
  private readonly _db: PrismaService;

  constructor(db: PrismaService) {
    this._db = db;
  }

  async addToken(token: string): Promise<void> {
    await this._db.authentication.create({
      data: { token },
    });
  }

  async checkAvailabilityToken(token: string): Promise<void> {
    const auth = await this._db.authentication.findUnique({
      where: { token },
    });

    if (!auth) {
      throw new InvariantError('refresh token tidak ditemukan di database');
    }
  }

  async deleteToken(token: string): Promise<void> {
    await this._db.authentication.delete({
      where: { token },
    });
  }
}

export default AuthenticationRepositoryPrisma;
