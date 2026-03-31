import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class ResetPasswordDto {
  @ApiProperty({
    description: 'Password reset token from forgot-password email',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  @IsString()
  token!: string;

  @ApiProperty({ minLength: 8, maxLength: 128, example: 'StrongPass123!' })
  @IsString()
  @MinLength(8)
  @MaxLength(128)
  newPassword!: string;
}
