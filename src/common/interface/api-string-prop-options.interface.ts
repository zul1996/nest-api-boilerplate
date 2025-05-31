export type ApiFieldType =
  | 'string'
  | 'number'
  | 'integer'
  | 'boolean'
  | 'date'
  | 'enum';

export interface ApiFieldPropOptions {
  type: ApiFieldType;
  description?: string;
  example?: any;
  required?: boolean;

  // String validation
  minLength?: number;
  maxLength?: number;
  regex?: RegExp;
  regexMessage?: string;
  notEmptyMessage?: string;
  minLengthMessage?: string;
  maxLengthMessage?: string;

  // Number validation
  min?: number;
  max?: number;
  minMessage?: string;
  maxMessage?: string;

  // Metadata (optional)
  format?: string;
  inputType?: string;
}