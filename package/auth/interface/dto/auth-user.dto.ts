import { ApiProperty } from '@nestjs/swagger';

export class AuthenticatedUserDto {
  @ApiProperty({
    format: 'uuid',
    example: 'a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6',
  })
  userId!: string;

  @ApiProperty({ example: 'john.doe@chimera.com' })
  email!: string;
}
