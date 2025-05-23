import { ApiFieldProp } from 'src/common/decorators/api-field-prop.decorator';
import { FieldMeta } from 'src/common/decorators/field-metada.decorator';
import { DbFilterOpr, fieldVisibility } from 'src/common/enums/metada.enum';
import { getFilterOprMeta } from 'src/common/utils/db-filter.helper';

export class LoginUserDto {
  @ApiFieldProp({
    type: 'string',
    description: 'Username',
    example: 'john_doe',
    required: true,
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

  @ApiFieldProp({
    type: 'string',
    description: 'Password',
    example: 'password123',
    required: true,
    regex: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
    regexMessage:
      'Password must contain at least one uppercase letter, one lowercase letter, and one number',
  })
  @FieldMeta({
    label: 'Password',
    order: 2,
    })
  password: string;
}
