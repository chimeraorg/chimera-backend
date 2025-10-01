import { ApiProperty } from '@nestjs/swagger';
import { UserCreatedOutput } from '@package/users/application/create-user.use-case';

export class UserResponseDto {
  @ApiProperty({
    format: 'uuid',
    example: 'a1b2c3d4-e5f6-07g8h-09i0j-k1l2m3n4o5p6',
  })
  readonly id!: string;

  @ApiProperty({ example: 'john.dow@chimera.com' })
  readonly email!: string;

  @ApiProperty({ example: 'John Doe' })
  readonly fullName!: string;

  @ApiProperty({ example: '2023-10-27T10:00:00.000Z' })
  readonly createdAt!: Date;

  constructor(output: UserCreatedOutput) {
    this.id = output.id;
    this.email = output.email;
    this.fullName = output.fullName;
    this.createdAt = output.createdAt;
  }
}
