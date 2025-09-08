import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AddUserUseCase } from 'src/Applications/use_case/AddUserUseCase';
import { CreateUserDto, PostUserResponseDto } from './dto/post-user.dto';
import { ApiCreatedResponse } from '@nestjs/swagger';

@Controller('users')
export class UsersController {
  constructor(private readonly addUserUseCase: AddUserUseCase) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({
    description: 'user registered successfully',
    type: PostUserResponseDto,
  })
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
