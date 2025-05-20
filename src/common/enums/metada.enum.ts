export enum fieldVisibility {
  Active = 'active',
  Readonly = 'readonly',
  Hidden = 'hidden',
  Disabled = 'disabled',
}

export enum dbFilterValueType {
  None = 'none',
  One = 'one',
  Two = 'two',
  Many = 'many',
}

export enum DbDataType {
  String = 'string',
  Number = 'number',
  Decimal = 'decimal',
  Date = 'date',
  Datetime = 'datetime',
  Boolean = 'boolean',
  Json = 'json',
}

export enum DbFilterOpr {
  Eq = 'Eq',
  Neq = 'Neq',
  In = 'In',
  NotIn = 'NotIn',
  Gt = 'Gt',
  Gte = 'Gte',
  Lt = 'Lt',
  Lte = 'Lte',
  Between = 'Between',
  StartsWith = 'StartsWith',
  EndsWith = 'EndsWith',
  Contains = 'Contains',
  ToDay = 'ToDay',
}