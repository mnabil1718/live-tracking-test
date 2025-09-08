import { OmitType } from '@nestjs/swagger';
import { ApiResponseDto } from '../../dto/api-response.dto';

export class DeleteAuthenticationResponseDto extends OmitType(ApiResponseDto, [
  'data',
] as const) {}
