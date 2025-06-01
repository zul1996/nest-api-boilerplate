import 'reflect-metadata';
import { MetadataFieldOption } from '../interface/metadata-field.interface';
import { DialogMetadata } from '../interface/dialog-metadata.interface';
import { CrudMetaOptions } from '../interface/dialog-metadata-options.interface';
import { Logger } from '@nestjs/common';
import { fieldVisibility } from '../enums/metada.enum';

export const FIELD_META_KEY = Symbol('field-meta');
export const FIELD_META_PROPS = Symbol('field-meta-props');
// Cache untuk visible fields (field name saja)
const visibleFieldsCache = new WeakMap<Function, string[]>();


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

function getVisibleFields<T>(dtoClass: new () => T): string[] {
  if (visibleFieldsCache.has(dtoClass)) {
    return visibleFieldsCache.get(dtoClass)!;
  }

  const props: string[] =
    Reflect.getMetadata(FIELD_META_PROPS, dtoClass.prototype) || [];

  const visibleFields = props.filter((prop) => {
    const meta: MetadataFieldOption = Reflect.getMetadata(
      FIELD_META_KEY,
      dtoClass.prototype,
      prop,
    );
    return meta?.grid === fieldVisibility.Active;
  });

  visibleFieldsCache.set(dtoClass, visibleFields);

  return visibleFields;
}

export function filterDtoFieldsByVisibility<T extends object>(
  dto: T,
  dtoClass: new () => T,
): Partial<T> {
  const props: string[] =
    Reflect.getMetadata(FIELD_META_PROPS, dtoClass.prototype) || [];

  const visibleFields = props
    .map((prop) => {
      const meta: MetadataFieldOption = Reflect.getMetadata(
        FIELD_META_KEY,
        dtoClass.prototype,
        prop,
      );
      if (meta?.grid === fieldVisibility.Active) {
        return { field: prop, order: meta.order ?? 0 };
      }
      return null;
    })
    .filter((x): x is { field: string; order: number } => x !== null)
    .sort((a, b) => a.order - b.order)
    .map((x) => x.field);

  const filtered: Partial<T> = {};
  for (const field of visibleFields) {
    if (field in dto) {
      filtered[field] = dto[field];
    }
  }

  return filtered;
}

