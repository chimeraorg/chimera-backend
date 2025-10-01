import { ApiProperty } from '@nestjs/swagger';

export class LoginResponseDto {
  @ApiProperty({
    example: 'accessToken',
  })
  readonly accessToken!: string;
}
