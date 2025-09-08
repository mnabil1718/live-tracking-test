import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { ApiResponseDto } from '../../dto/api-response.dto';

export class RefreshTokenDto {
  @IsString()
  @IsNotEmpty()
  refreshToken: string;
}

export class RefreshAuthenticationData {
  accessToken: string;
}

export class RefreshAuthenticationResponseDto extends ApiResponseDto<RefreshAuthenticationData> {
  @ApiProperty({ type: RefreshAuthenticationData })
  declare data: RefreshAuthenticationData;
}
