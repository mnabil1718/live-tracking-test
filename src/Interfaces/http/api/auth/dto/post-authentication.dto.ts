import { IsNotEmpty, IsString } from 'class-validator';
import { ApiResponseDto } from '../../dto/api-response.dto';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}

export class LoginResponseData {
  accessToken: string;
  refreshToken: string;
}

export class LoginResponseDto extends ApiResponseDto<LoginResponseData> {
  @ApiProperty({ type: LoginResponseData })
  declare data: LoginResponseData;
}
