import { ApiProperty } from '@nestjs/swagger';
import { isNumber, IsOptional, IsString } from 'class-validator';
import { DB_FILTER_OPR_META } from 'src/common/constants/db-filter-opr-meta.constants';
import { ApiFieldProp } from 'src/common/decorators/api-field-prop.decorator';
import { FieldMeta } from 'src/common/decorators/field-metada.decorator';
import { fieldVisibility } from 'src/common/enums/metada.enum';
import { extractFieldMetadataFromDto } from 'src/common/utils/metadata/extract-field-metadata.util';

export class ProductDto {
  @FieldMeta({
    label: 'name',
    order: 0,
    grid: fieldVisibility.Active,
    searchable: true,
    searchOprs: [DB_FILTER_OPR_META.Eq, DB_FILTER_OPR_META.Contains],
    sortable: true,
    onCellFilter: true,
  })
  @ApiFieldProp({
    type: 'string',
    required: false,
    description: 'The name of the product',
    example: 'Product Name Example',
  })
  name: string;

  @FieldMeta({
    label: 'description',
    order: 1,
    grid: fieldVisibility.Active,
    searchable: true,
    searchOprs: [DB_FILTER_OPR_META.Eq, DB_FILTER_OPR_META.Contains],
    sortable: true,
    onCellFilter: true,
  })
  @ApiFieldProp({
    type: 'string',
    required: false,
    description: 'A brief description of the product',
    example: 'This is a sample product description.',
  })
  description?: string;

  @FieldMeta({
    label: 'price',
    order: 2,
    grid: fieldVisibility.Active,
    searchable: true,
    sortable: true,
    onCellFilter: true,
  })
  price: number;

  @FieldMeta({
    label: 'flagAktif',
    order: 3,
    grid: fieldVisibility.Disabled,
    searchable: true,
    searchOprs: [DB_FILTER_OPR_META.Eq, DB_FILTER_OPR_META.Contains],
    sortable: true,
    onCellFilter: true,
  })
  @ApiFieldProp({
    type: 'number',
    required: true,
    description: 'Indicates whether the product is active (1) or inactive (0)',
    example: 1,
    min: 0,
    max: 1,
    format: 'int32',
  })
  flagAktif?: number;
}

console.log(extractFieldMetadataFromDto(ProductDto));
