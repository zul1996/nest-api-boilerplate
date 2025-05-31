
import { GridFieldMetadata } from "src/common/enums/gridField-metada.enum";
import { CrudMetadata } from "src/common/interface/crud-metada.interface";
import { DialogMetadata } from "src/common/interface/dialog-metadata.interface";
import { extractFieldMetadataFromDto } from "./extract-field-metadata.util";
import { PaginationMetadata } from "src/common/interface/pagination.interface";
import { GridMetadata } from "src/common/interface/gird-metadata.interface";

export function extractCrudMetadata(
    dtoClass: Function,
    entityClass: Function,
): CrudMetadata {
    const title = Reflect.getMetadata('crud:title', entityClass) || '';
    const idField = Reflect.getMetadata('crud:idField', entityClass) || 'id';
    const rawDialog = Reflect.getMetadata('crud:dialog', entityClass) ?? {};
    const dialog: DialogMetadata = {
      title: rawDialog.title ?? '',
      action: rawDialog.action ?? '',
      supportMaximized: rawDialog.supportMaximized ?? false,
      fullWidth: rawDialog.fullWidth ?? false,
      fullHeight: rawDialog.fullHeight ?? false,
      maximized: rawDialog.maximized ?? false,
      cardStyle: rawDialog.cardStyle ?? '',
    };

  const fields: GridFieldMetadata[] = extractFieldMetadataFromDto(dtoClass);
  
  const defPagination: PaginationMetadata = {
    sortBy: '',
    descending: false,
    page: 0,
    size: 10,
    filterField: {},
  };

  const grid: GridMetadata = {
    fields,
    defPagination,
  };

  const crudMetadata: CrudMetadata = {
    title,
    idField,
    dialog,
    grid,
    formCreate: null,
    formUpdate: null,
    formDetail: null,
  };

  return crudMetadata;
}