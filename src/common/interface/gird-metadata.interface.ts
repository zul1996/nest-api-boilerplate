import { GridFieldMetadata } from "../enums/gridField-metada.enum";
import { PaginationMetadata } from "./pagination.interface";


export interface GridMetadata {
  fields: GridFieldMetadata[];
  defPagination: PaginationMetadata;
}
