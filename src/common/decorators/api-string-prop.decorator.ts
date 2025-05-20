import { applyDecorators } from '@nestjs/common';
import { ApiStringPropOptions } from '../types/ApiStringPropOptions.interface';
import { ApiProperty } from '@nestjs/swagger';
import {
  ValidateIf,
  IsString,
  IsNotEmpty,
  MinLength,
  MaxLength,
  Matches,
} from 'class-validator';

export function ApiStringProp(options: ApiStringPropOptions = {}) {
  const {
    description,
    example,
    required,
    minLength,
    maxLength,
    regex,
    regexMessage,
    notEmptyMessage,
    minLengthMessage,
    maxLengthMessage,
    type,
  } = options;

  return applyDecorators(
    ApiProperty({
      description,
      example,
      required,
      minLength,
      maxLength,
      pattern: regex ? regex.source : undefined,
      type: String,
    }),

    // Jika required false, validasi hanya jika ada value
    ValidateIf((_, value) =>
      required ? true : value !== undefined && value !== null,
    ),

    IsString({ message: `${description || 'Field'} must be a string` }),

    ...(required
      ? [
          IsNotEmpty({
            message:
              notEmptyMessage ||
              `${description || 'Field'} should not be empty`,
          }),
        ]
      : []),

    ...(minLength !== undefined
      ? [
          MinLength(minLength, {
            message:
              minLengthMessage ||
              `${description || 'Field'} must be at least ${minLength} characters`,
          }),
        ]
      : []),

    ...(maxLength !== undefined
      ? [
          MaxLength(maxLength, {
            message:
              maxLengthMessage ||
              `${description || 'Field'} must be at most ${maxLength} characters`,
          }),
        ]
      : []),

    ...(regex
      ? [
          Matches(regex, {
            message:
              regexMessage || `${description || 'Field'} format is invalid`,
          }),
        ]
      : []),
  );
}
