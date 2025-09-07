import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AddUserUseCase } from 'src/Applications/use_case/AddUserUseCase';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly addUserUseCase: AddUserUseCase) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async postUser(@Body() payload: CreateUserDto) {
    const addedUser = await this.addUserUseCase.execute(payload);
    return {
      status: 'success',
      data: {
        addedUser,
      },
    };
  }
}
