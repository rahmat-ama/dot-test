import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({ example: 'budi@email.com' })
  @IsOptional()
  @IsEmail(undefined, { message: 'Email format is invalid' })
  email?: string;

  @ApiProperty({ example: 'budi123' })
  @IsOptional()
  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  password?: string;

  @ApiProperty({ example: 'Budi' })
  @IsOptional()
  @IsString()
  name?: string;
}
