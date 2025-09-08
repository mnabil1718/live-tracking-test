import { IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiResponseDto } from '../../dto/api-response.dto';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string;

  @IsString()
  @IsNotEmpty()
  fullname: string;
}

export class PostUserResponseData {
  id: string;
  username: string;
  fullname: string;
}

export class PostUserResponseDto extends ApiResponseDto<PostUserResponseData> {
  @ApiProperty({ type: PostUserResponseData })
  declare data: PostUserResponseData;
}
