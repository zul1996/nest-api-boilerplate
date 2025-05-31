import { Logger } from '@nestjs/common';
import 'reflect-metadata';
import { FIELD_META_KEY, FIELD_META_PROPS } from 'src/common/decorators/field-metada.decorator';
import { GridFieldMetadata } from 'src/common/enums/gridField-metada.enum';

export function extractFieldMetadataFromDto(
  dtoClass: Function,
): GridFieldMetadata[] {
  const prototype = dtoClass.prototype;

  const propertyNames: string[] =
    Reflect.getMetadata(FIELD_META_PROPS, prototype) || [];
  Logger.log(
    `FieldMeta props: ${propertyNames.join(', ')}`,
    'extractFieldMetadataFromDto',
  );

  const fields: GridFieldMetadata[] = [];

  for (const key of propertyNames) {
    const meta: GridFieldMetadata | undefined = Reflect.getMetadata(
      FIELD_META_KEY,
      prototype,
      key,
    );
    if (meta) {
      Logger.log(`Metadata found for ${key}`, 'extractFieldMetadataFromDto');
      fields.push({
        ...meta,
        name: key,
        field: meta.field || key,
      });
    }
  }

  return fields;
}


// export function extractFieldMetadataFromDto(
//   dtoClass: Function,
// ): GridFieldMetadata[] {
//   const fields: GridFieldMetadata[] = [];

//   const dtoInstance = new (dtoClass as any)();
//   const properyNames= Object.keys(dtoInstance);
//   const dtoPrototype = dtoClass.prototype;
//   const propertyNames = Object.getOwnPropertyNames(dtoPrototype);


//   Logger.log(
//     `Extracting metadata for: ${dtoClass.name}`,
//     'extractFieldMetadataFromDto',
//   );
//   Logger.log(
//     `Properties found: ${propertyNames.join(', ')}`,
//     'extractFieldMetadataFromDto',
//   );

//   for (const propertyName of propertyNames) {
//     const meta: GridFieldMetadata | undefined = Reflect.getMetadata(
//       FIELD_META_KEY,
//       dtoClass.prototype,
//       propertyName,
//     );

//     // for (const propertyName of propertyNames) {
//     //   if (propertyName === 'constructor') continue;

//     //   const meta: GridFieldMetadata | undefined = Reflect.getMetadata(
//     //     FIELD_META_KEY,
//     //     dtoPrototype,
//     //     propertyName,
//     //   );

//     if (!meta) {
//       Logger.warn(
//         `No metadata found for property: ${propertyName}`,
//         'extractFieldMetadataFromDto',
//       );
//     } else {
//       Logger.log(
//         `Metadata found for property: ${propertyName}`,
//         'extractFieldMetadataFromDto',
//       );
//       fields.push({
//         ...meta,
//         name: propertyName,
//         field: meta.field || propertyName,
//       });
//     }
//   }

//   return fields;
// }
