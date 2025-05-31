import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsInt,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
  IsBoolean,
  IsObject,
  IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';

export class SortDto {
  @ApiProperty({ example: 'name' })
  @IsString()
  field: string;

  @ApiProperty({ example: 'ASC', enum: ['ASC', 'DESC'] })
  @IsEnum(['ASC', 'DESC'])
  direction: 'ASC' | 'DESC';
}

// Sesuaikan interface FilterParsed kamu, contoh:
export class FilterParsedDto {
  @ApiPropertyOptional({ default: false })
  @IsBoolean()
  @IsOptional()
  not?: boolean;

  @ApiPropertyOptional({ default: true })
  @IsBoolean()
  @IsOptional()
  and?: boolean;

  @ApiPropertyOptional({ type: Object, example: { Eq: { name: 'foo' } } })
  @IsObject()
  @IsOptional()
  field?: Record<string, Record<string, any>>;
}

export class PaginationRequestDto {
  @ApiPropertyOptional({ default: 0, minimum: 0 })
  @IsInt()
  @Min(0)
  @IsOptional()
  page?: number;

  @ApiPropertyOptional({ default: 10, minimum: 1 })
  @IsInt()
  @Min(1)
  @IsOptional()
  size?: number;

  @ApiPropertyOptional()
  @ValidateNested()
  @Type(() => SortDto)
  @IsOptional()
  sort?: SortDto;

  @ApiPropertyOptional()
  @ValidateNested()
  @Type(() => FilterParsedDto)
  @IsOptional()
  filter?: FilterParsedDto; // note: property named "filter"
}
