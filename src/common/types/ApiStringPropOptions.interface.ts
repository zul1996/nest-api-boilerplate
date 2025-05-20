import { ApiPropertyOptions } from '@nestjs/swagger';

export type ApiStringPropOptions = Partial<ApiPropertyOptions> & {
  description?: string;
  example?: string;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  regex?: RegExp;
  regexMessage?: string;
  notEmptyMessage?: string;
  minLengthMessage?: string;
  maxLengthMessage?: string;
  type?: string;
};