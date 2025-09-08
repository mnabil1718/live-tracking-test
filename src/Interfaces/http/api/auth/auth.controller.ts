import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Post,
  Put,
} from '@nestjs/common';
import { LoginDto, LoginResponseDto } from './dto/post-authentication.dto';
import { LoginUserUseCase } from 'src/Applications/use_case/LoginUserUseCase';
import { RefreshAuthenticationUseCase } from 'src/Applications/use_case/RefreshAuthenticationUseCase';
import { LogoutUserUseCase } from 'src/Applications/use_case/LogoutUserUseCase';
import {
  RefreshAuthenticationResponseDto,
  RefreshTokenDto,
} from './dto/put-authentication.dto';
import { ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';
import { DeleteAuthenticationResponseDto } from './dto/delete-authentication.dto';

@Controller('auth')
export class AuthenticationsController {
  constructor(
    private readonly loginUserUseCase: LoginUserUseCase,
    private readonly logoutUserUseCase: LogoutUserUseCase,
    private readonly refreshAuthenticationUseCase: RefreshAuthenticationUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({
    description: 'user logged in successfully',
    type: LoginResponseDto,
  })
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
  @ApiOkResponse({
    description: 'access token refreshed successfully',
    type: RefreshAuthenticationResponseDto,
  })
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
  @ApiOkResponse({
    description: 'user logged out successfully',
    type: DeleteAuthenticationResponseDto,
  })
  async deleteAuthentication(@Body() payload: RefreshTokenDto) {
    await this.logoutUserUseCase.execute(payload);
    return {
      status: 'success',
    };
  }
}
