import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ApiResponseDto<T = any> {
  @ApiProperty({ description: 'response status' })
  status: string;

  @ApiPropertyOptional({ description: 'optional response payload data' })
  data?: T;
}
