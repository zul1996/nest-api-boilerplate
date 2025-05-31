import 'reflect-metadata';
import { MetadataFieldOption } from '../interface/metadata-field.interface';
import {  DialogMetadata } from '../interface/dialog-metadata.interface';
import { CrudMetaOptions } from '../interface/dialog-metadata-options.interface';
import { Logger } from '@nestjs/common';

export const FIELD_META_KEY = Symbol('field-meta');
export const FIELD_META_PROPS = Symbol('field-meta-props');

export function FieldMeta(options: MetadataFieldOption): PropertyDecorator {
  return (target, propertyKey) => {
    Reflect.defineMetadata(FIELD_META_KEY, options, target, propertyKey);

    // Track semua field yang dipasang FieldMeta
    const existingProps: string[] =
      Reflect.getMetadata(FIELD_META_PROPS, target) || [];
    
    Reflect.defineMetadata(
      FIELD_META_PROPS,
      [...existingProps, propertyKey.toString()],
      target,
    );
  };
}

export function getFieldMeta(
  target: any,
  propertyKey: string,
): MetadataFieldOption | undefined {
  return Reflect.getMetadata(FIELD_META_KEY, target, propertyKey);
}

export function CrudMeta(options: CrudMetaOptions) {
  return (target: Function) => {
    Reflect.defineMetadata('crud:title', options.title, target);
    Reflect.defineMetadata('crud:idField', options.idField, target);

    const dialog: DialogMetadata = {
      title: options.dialog?.title ?? '',
      action: options.dialog?.action ?? '',
      supportMaximized: options.dialog?.supportMaximized ?? false,
      fullWidth: options.dialog?.fullWidth ?? false,
      fullHeight: options.dialog?.fullHeight ?? false,
      maximized: options.dialog?.maximized ?? false,
      cardStyle: options.dialog?.cardStyle ?? '',
    };

    Reflect.defineMetadata('crud:dialog', dialog, target);
  };
}