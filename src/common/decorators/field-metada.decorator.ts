import 'reflect-metadata';
import { MetadataFieldOption } from '../types/metadata-field.interface';

export const FIELD_META_KEY = Symbol('field-meta');

export function FieldMeta(options: MetadataFieldOption): PropertyDecorator {
  return (target, propertyKey) => {
    Reflect.defineMetadata(FIELD_META_KEY, options, target, propertyKey);
  };
}

export function getFieldMeta(
  target: any,
  propertyKey: string,
): MetadataFieldOption | undefined {
  return Reflect.getMetadata(FIELD_META_KEY, target, propertyKey);
}
