import { DialogMetadata } from "./dialog-metadata.interface";
import { GridMetadata } from "./gird-metadata.interface";

export interface CrudMetadata {
  title: string;
  idField: string;
  grid: GridMetadata;
  dialog: DialogMetadata;
  formCreate?: null;
  formUpdate?: null;
  formDetail?: null;
}

