import { ApiStringProp } from 'src/common/decorators/api-string-prop.decorator';
import { FieldMeta } from 'src/common/decorators/field-metada.decorator';
import { DbFilterOpr, fieldVisibility } from 'src/common/enums/metada.enum';
import { getFilterOprMeta } from 'src/common/utils/db-filter.helper';

export class LoginUserDto {
  @ApiStringProp({
    description: 'Username',
    example: 'john_doe',
    required: true,
    notEmptyMessage: 'Username wajib diisi',
    minLength: 3,
    maxLength: 20,
    regex: /^[a-zA-Z0-9_]+$/,
    regexMessage: 'Username hanya boleh huruf, angka, dan underscore',
  })
  @FieldMeta({
    label: 'Username',
    order: 1,
    grid: fieldVisibility.Active,
    download: fieldVisibility.Disabled,
    detail: fieldVisibility.Active,
    create: fieldVisibility.Active,
    update: fieldVisibility.Active,
    searchable: true,
    sortable: true,
    searchOprs: getFilterOprMeta([DbFilterOpr.Eq, DbFilterOpr.Contains]),
  })
  username: string;

  @ApiStringProp({
    description: 'Password',
    required: true,
    example: 'password123',
    notEmptyMessage: 'Password wajib diisi',
    minLength: 8,
    maxLength: 50,
  })
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
    searchOprs: getFilterOprMeta([DbFilterOpr.Eq]),
  })
  password: string;
}
