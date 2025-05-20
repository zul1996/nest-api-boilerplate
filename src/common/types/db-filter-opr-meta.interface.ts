import { DbDataType, dbFilterValueType } from "../enums/metada.enum";

export interface DbFilterOprMeta {
    name: string; // nama operator
    label: string; // label operator
    order: number; // urutan operator
    valueType: dbFilterValueType;
    dataType: DbDataType[];
 }