import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsBoolean,
  Matches,
  Max,
  MaxLength,
  Min,
  MinLength,
  ValidateIf,
} from 'class-validator';
import { applyDecorators } from '@nestjs/common';
import {
  ApiFieldPropOptions,
  ApiFieldType,
} from '../types/ApiStringPropOptions.interface';

/**
 * Custom decorator for API field properties with validation
 * @param options Configuration options for the field
 */
export function ApiFieldProp(options: ApiFieldPropOptions) {
  const {
    type,
    description,
    example,
    required = false,
    minLength,
    maxLength,
    regex,
    regexMessage,
    notEmptyMessage,
    minLengthMessage,
    maxLengthMessage,
    min,
    max,
    minMessage,
    maxMessage,
    format,
  } = options;

  const decorators: Array<PropertyDecorator | MethodDecorator> = [];

  // Add Swagger documentation
  decorators.push(
    ApiProperty({
      description,
      example,
      required,
      type: mapTypeToSwagger(type),
      format,
      pattern: regex?.source,
      minimum: min,
      maximum: max,
      minLength,
      maxLength,
    }),
  );

  // Add conditional validation
  decorators.push(
    ValidateIf(
      (_, value) => required || (value !== undefined && value !== null),
    ),
  );

  // Add type-specific validators
  switch (type) {
    case 'string':
      addStringValidators(decorators, {
        description,
        required,
        minLength,
        maxLength,
        regex,
        notEmptyMessage,
        minLengthMessage,
        maxLengthMessage,
        regexMessage,
      });
      break;

    case 'number':
    case 'integer':
      addNumberValidators(decorators, {
        description,
        min,
        max,
        minMessage,
        maxMessage,
      });
      break;

    case 'boolean':
      decorators.push(
        IsBoolean({ message: `${description || 'Field'} must be a boolean` }),
      );
      break;

    default:
      throw new Error(`Unsupported field type: ${type}`);
  }

  return applyDecorators(...decorators);
}

/**
 * Maps API field types to Swagger types
 */
function mapTypeToSwagger(type: ApiFieldType): any {
  switch (type) {
    case 'string':
      return String;
    case 'number':
    case 'integer':
      return Number;
    case 'boolean':
      return Boolean;
    case 'date':
      return Date;
    default:
      return String;
  }
}

/**
 * Adds string-specific validators
 */
function addStringValidators(
  decorators: Array<PropertyDecorator | MethodDecorator>,
  options: {
    description?: string;
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    regex?: RegExp;
    notEmptyMessage?: string;
    minLengthMessage?: string;
    maxLengthMessage?: string;
    regexMessage?: string;
  },
) {
  const {
    description,
    required,
    minLength,
    maxLength,
    regex,
    notEmptyMessage,
    minLengthMessage,
    maxLengthMessage,
    regexMessage,
  } = options;

  decorators.push(
    IsString({ message: `${description || 'Field'} must be a string` }),
  );

  if (required) {
    decorators.push(
      IsNotEmpty({
        message: notEmptyMessage || `${description || 'Field'} is required`,
      }),
    );
  }

  if (minLength !== undefined) {
    decorators.push(
      MinLength(minLength, {
        message:
          minLengthMessage ||
          `${description || 'Field'} must be at least ${minLength} characters`,
      }),
    );
  }

  if (maxLength !== undefined) {
    decorators.push(
      MaxLength(maxLength, {
        message:
          maxLengthMessage ||
          `${description || 'Field'} must be at most ${maxLength} characters`,
      }),
    );
  }

  if (regex) {
    decorators.push(
      Matches(regex, {
        message: regexMessage || `${description || 'Field'} format is invalid`,
      }),
    );
  }
}

/**
 * Adds number-specific validators
 */
function addNumberValidators(
  decorators: Array<PropertyDecorator | MethodDecorator>,
  options: {
    description?: string;
    min?: number;
    max?: number;
    minMessage?: string;
    maxMessage?: string;
  },
) {
  const { description, min, max, minMessage, maxMessage } = options;

  decorators.push(
    IsNumber({}, { message: `${description || 'Field'} must be a number` }),
  );

  if (min !== undefined) {
    decorators.push(
      Min(min, {
        message:
          minMessage || `${description || 'Field'} must be at least ${min}`,
      }),
    );
  }

  if (max !== undefined) {
    decorators.push(
      Max(max, {
        message:
          maxMessage || `${description || 'Field'} must be at most ${max}`,
      }),
    );
  }
}
