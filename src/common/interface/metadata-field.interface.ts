import { fieldVisibility } from "src/common/enums/metada.enum";
import { DbFilterOprMeta } from "./db-filter-opr-meta.interface";


export interface MetadataFieldOption {
  label: string;
  order?: number;
  grid?: fieldVisibility;
  download?: fieldVisibility;
  detail?: fieldVisibility;
  create?: fieldVisibility;
  update?: fieldVisibility;
  searchable?: boolean;
  searchOprs?: DbFilterOprMeta[];
  sortable?: boolean;
  onCellFilter?: boolean;
  dColSize?: number;
}