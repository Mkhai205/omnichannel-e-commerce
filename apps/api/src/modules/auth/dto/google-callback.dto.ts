import { IsOptional, IsString, MaxLength } from 'class-validator';

export class GoogleCallbackDto {
  @IsString()
  @MaxLength(4096)
  code!: string;

  @IsString()
  @MaxLength(512)
  state!: string;

  @IsOptional()
  @IsString()
  @MaxLength(2048)
  error?: string;
}
