import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Post,
  Put,
} from '@nestjs/common';
import { LoginUserUseCase } from 'src/Applications/use_case/LoginUserUseCase';
import { LoginDto } from './dto/login.dto';
import { RefreshAuthenticationUseCase } from 'src/Applications/use_case/RefreshAuthenticationUseCase';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { LogoutUserUseCase } from 'src/Applications/use_case/LogoutUserUseCase';

@Controller('auth')
export class AuthenticationsController {
  constructor(
    private readonly loginUserUseCase: LoginUserUseCase,
    private readonly logoutUserUseCase: LogoutUserUseCase,
    private readonly refreshAuthenticationUseCase: RefreshAuthenticationUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async postAuthentication(@Body() payload: LoginDto) {
    const { accessToken, refreshToken } =
      await this.loginUserUseCase.execute(payload);
    return {
      status: 'success',
      data: {
        accessToken,
        refreshToken,
      },
    };
  }

  @Put()
  async putAuthentication(@Body() payload: RefreshTokenDto) {
    const accessToken =
      await this.refreshAuthenticationUseCase.execute(payload);
    return {
      status: 'success',
      data: {
        accessToken,
      },
    };
  }

  @Delete()
  async deleteAuthentication(@Body() payload: RefreshTokenDto) {
    await this.logoutUserUseCase.execute(payload);
    return {
      status: 'success',
    };
  }
}
