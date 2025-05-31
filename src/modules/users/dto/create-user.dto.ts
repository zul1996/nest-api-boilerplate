import { ApiBody, ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiFieldProp } from 'src/common/decorators/api-field-prop.decorator';
import { FieldMeta } from 'src/common/decorators/field-metada.decorator';
import { DbFilterOpr, fieldVisibility } from 'src/common/enums/metada.enum';
import { getFilterOprMeta } from 'src/common/utils/db-filter.helper';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  @ApiFieldProp({
    type: 'string',
    description: 'Username of the user',
    example: 'john_doe',
    minLength: 3,
    maxLength: 20,
    regex: /^[a-zA-Z0-9_]+$/,
    regexMessage: 'Username can only contain letters, numbers, and underscores',
    notEmptyMessage: 'Username cannot be empty',
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
    onCellFilter: true,
    searchOprs: getFilterOprMeta([DbFilterOpr.Eq, DbFilterOpr.Contains]),
  })
  username: string;

  @ApiProperty()
  @ApiFieldProp({
    type: 'string',
    description: 'Password of the user',
    example: 'password123',
    minLength: 6,
    maxLength: 100,
    regex: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{6,}$/,
    regexMessage:
      'Password must be at least 6 characters, include letters and numbers',
    notEmptyMessage: 'Password cannot be empty',
    required: true,
  })
  @FieldMeta({
    label: 'Password',
    order: 2,
    grid: fieldVisibility.Active,
    download: fieldVisibility.Disabled,
    detail: fieldVisibility.Active,
    create: fieldVisibility.Active,
    update: fieldVisibility.Active,
    searchable: true,
    sortable: true,
    onCellFilter:true,
    searchOprs: getFilterOprMeta([DbFilterOpr.Eq, DbFilterOpr.Contains]),

  })
  password: string;

  @ApiProperty({ required: false })
  @ApiFieldProp({
    type: 'string',
    description: 'Full name of the user',
    example: 'John Doe',
    required: false,
  })
  fullName?: string;

  @ApiProperty({ required: false })
  @ApiFieldProp({
    type: 'string',
    description: 'Email address',
    example: 'john@example.com',
    required: false,
    regex: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    regexMessage: 'Invalid email format',
  })
  email?: string;

  @ApiProperty({ required: false })
  @ApiFieldProp({
    type: 'string',
    description: 'Phone number',
    example: '+62123456789',
    required: false,
    regex: /^\+?[0-9]{10,15}$/,
    regexMessage: 'Invalid phone number format',
  })
  phoneNumber?: string;

  @ApiProperty({ required: false })
  @ApiFieldProp({
    type: 'string',
    description: 'Role of the user',
    example: 'user',
    required: false,
  })
  role?: string;
}

export class updateUserDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @MinLength(6)
  password: string;
}
