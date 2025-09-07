import { UserRepository } from 'src/Domains/users/UserRepository';
import { PrismaService } from '../database/prisma/prisma.service';
import InvariantError from 'src/Commons/exceptions/InvariantError';
import { RegisterUser } from 'src/Domains/users/entities/RegisterUser';
import { RegisteredUser } from 'src/Domains/users/entities/RegisteredUser';
import { Injectable } from '@nestjs/common';

@Injectable()
class UserRepositoryPrisma implements UserRepository {
  private readonly _db: PrismaService;
  private readonly _idGenerator: () => string;

  constructor(db: PrismaService, idGenerator: () => string) {
    this._db = db;
    this._idGenerator = idGenerator;
  }

  async verifyAvailableUsername(username: string): Promise<void> {
    const existingUser = await this._db.user.findUnique({
      where: { username },
      select: { id: true },
    });

    if (existingUser) {
      throw new InvariantError('username tidak tersedia');
    }
  }

  async addUser(registerUser: RegisterUser): Promise<RegisteredUser> {
    const { username, password, fullname } = registerUser;
    const id = `user-${this._idGenerator()}`;

    const user = await this._db.user.create({
      data: {
        id,
        username,
        fullname,
        password,
      },
      select: {
        id: true,
        username: true,
        fullname: true,
      },
    });

    return new RegisteredUser(user);
  }

  async getPasswordByUsername(username: string): Promise<string> {
    const user: { password: string } | null = await this._db.user.findUnique({
      where: { username },
      select: { password: true },
    });

    if (!user) {
      throw new InvariantError('username tidak ditemukan');
    }

    return user.password;
  }

  async getIdByUsername(username: string): Promise<string> {
    const user: { id: string } | null = await this._db.user.findUnique({
      where: { username },
      select: { id: true },
    });

    if (!user) {
      throw new InvariantError('user tidak ditemukan');
    }

    return user.id;
  }
}

export default UserRepositoryPrisma;
