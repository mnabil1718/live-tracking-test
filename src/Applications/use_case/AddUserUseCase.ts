import { RegisterUser } from 'src/Domains/users/entities/RegisterUser';
import {
  USER_REPOSITORY,
  type UserRepository,
} from 'src/Domains/users/UserRepository';
import { PASSWORD_HASH, type PasswordHash } from '../security/PasswordHash';
import { Inject, Injectable } from '@nestjs/common';
import { RegisteredUser } from 'src/Domains/users/entities/RegisteredUser';

export interface AddUserUseCasePayload {
  username: string;
  password: string;
  fullname: string;
}

@Injectable()
export class AddUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: UserRepository,
    @Inject(PASSWORD_HASH) private readonly passwordHash: PasswordHash,
  ) {}

  async execute(payload: AddUserUseCasePayload): Promise<RegisteredUser> {
    const registerUser = new RegisterUser(payload);

    await this.userRepository.verifyAvailableUsername(registerUser.username);
    registerUser.password = await this.passwordHash.hash(registerUser.password);

    return this.userRepository.addUser(registerUser);
  }
}
