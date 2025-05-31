import { DbDataType, DbFilterOpr, fieldVisibility } from "./metada.enum";

export enum GridAlign {
  Left = 'left',
  Center = 'center',
  Right = 'right',
}

export enum FormInputTypeGroup {
  Text = 'text',
  Option = 'option',
  Date = 'date',
  Number = 'number',
}

export interface FeFormInput {
  type: {
    name: string;
    group: FormInputTypeGroup;
  };
  props?: Record<string, any>;
}

export interface GridFieldMetadata {
  name: string;
  order: number;
  align: GridAlign;
  label: string;
  field: string;
  sortable: boolean;
  searchable: boolean;
  searchOprs: DbFilterOpr[];
  visibility: fieldVisibility;
  onCellFilter: boolean;
  dataType: DbDataType;
  formInput?: FeFormInput;
}

