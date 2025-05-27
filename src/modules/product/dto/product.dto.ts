import { ApiProperty } from '@nestjs/swagger';
import { isNumber, IsOptional, IsString } from 'class-validator';

export class ProductDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ default: false })
  @IsOptional()
  flagAktif?: number;
}
