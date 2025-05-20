import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { FieldMeta } from 'src/common/decorators/field-metada.decorator';
import { DbFilterOpr, fieldVisibility } from 'src/common/enums/metada.enum';
import { getFilterOprMeta } from 'src/common/utils/db-filter.helper';

export class LoginUserDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @FieldMeta({
    label: 'Password',
    order: 2,
    grid: fieldVisibility.Active,
    download: fieldVisibility.Disabled,
    detail: fieldVisibility.Active,
    create: fieldVisibility.Active,
    update: fieldVisibility.Active,
    searchable: false,
    sortable: false,
    searchOprs: getFilterOprMeta([DbFilterOpr.Eq, DbFilterOpr.Contains]),
  })
  username: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @FieldMeta({
    label: 'Password',
    order: 2,
    grid: fieldVisibility.Active,
    download: fieldVisibility.Disabled,
    detail: fieldVisibility.Active,
    create: fieldVisibility.Active,
    update: fieldVisibility.Active,
    searchable: false,
    sortable: false,
    searchOprs: getFilterOprMeta([DbFilterOpr.Eq, DbFilterOpr.Contains]),
  })
  password: string;
}
