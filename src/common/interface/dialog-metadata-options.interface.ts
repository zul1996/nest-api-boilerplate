import { DialogMetadata } from "./dialog-metadata.interface";

export interface CrudMetaOptions {
  title: string;
  idField: string;
  dialog: Partial<DialogMetadata>;
}
