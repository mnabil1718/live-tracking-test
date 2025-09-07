import { RegisteredUser } from './entities/RegisteredUser';
import { RegisterUser } from './entities/RegisterUser';

export const USER_REPOSITORY = Symbol('USER_REPOSITORY');
export interface UserRepository {
  addUser(registerUser: RegisterUser): Promise<RegisteredUser>;
  verifyAvailableUsername(username: string): Promise<void>;
  getPasswordByUsername(username: string): Promise<string>;
  getIdByUsername(username: string): Promise<string>;
}
