import { EMPTY } from "rxjs";
import { DbDataType, DbFilterOpr, dbFilterValueType } from "../../form-meta/metada.enum";
import { DbFilterOprMeta } from "../types/db-filter-opr-meta.interface";

export const DB_FILTER_OPR_META: Record<DbFilterOpr, DbFilterOprMeta> = {
    [DbFilterOpr.Eq]: {
        name: DbFilterOpr.Eq,
        label: 'Equal',
        order: 1,
        valueType: dbFilterValueType.One,
        dataType: [DbDataType.String, DbDataType.Number, DbDataType.Boolean],
    },
    [DbFilterOpr.Neq]: {
        name: DbFilterOpr.Neq,
        label: 'Not Equal',
        order: 2,
        valueType: dbFilterValueType.One,
        dataType: [DbDataType.String, DbDataType.Number, DbDataType.Boolean],
    },
    [DbFilterOpr.In]: {
        name: DbFilterOpr.In,
        label: 'In',
        order: 3,
        valueType: dbFilterValueType.Many,
        dataType: [DbDataType.String, DbDataType.Number, DbDataType.Boolean],
    },
    [DbFilterOpr.NotIn]: {
        name: DbFilterOpr.NotIn,
        label: 'Not In',
        order: 4,
        valueType: dbFilterValueType.Many,
        dataType: [DbDataType.String, DbDataType.Number, DbDataType.Boolean],
    },
    [DbFilterOpr.Gt]: {
        name: DbFilterOpr.Gt,
        label: 'Greater Than',
        order: 5,
        valueType: dbFilterValueType.One,
        dataType: [DbDataType.Number, DbDataType.Decimal, DbDataType.Date, DbDataType.Datetime],
    },
    [DbFilterOpr.Gte]: {
        name: DbFilterOpr.Gte,
        label: 'Greater Than or Equal',
        order: 6,
        valueType: dbFilterValueType.One,
        dataType: [DbDataType.Number, DbDataType.Decimal, DbDataType.Date, DbDataType.Datetime],
    },
    [DbFilterOpr.Lt]: {
        name: DbFilterOpr.Lt,
        label: 'Less Than',
        order: 7,
        valueType: dbFilterValueType.One,
        dataType: [DbDataType.Number, DbDataType.Decimal, DbDataType.Date, DbDataType.Datetime],
    },
    [DbFilterOpr.Lte]: {
        name: DbFilterOpr.Lte,
        label: 'Less Than or Equal',
        order: 8,
        valueType: dbFilterValueType.One,
        dataType: [DbDataType.Number, DbDataType.Decimal, DbDataType.Date, DbDataType.Datetime],
    },
    [DbFilterOpr.Between]: {
        name: DbFilterOpr.Between,
        label: 'Between',
        order: 9,
        valueType: dbFilterValueType.Two,
        dataType: [DbDataType.Number, DbDataType.Decimal, DbDataType.Date, DbDataType.Datetime],
    },
    [DbFilterOpr.StartsWith]: {
        name: DbFilterOpr.StartsWith,
        label: 'Starts With',
        order: 10,
        valueType: dbFilterValueType.One,
        dataType: [],
    },
    [DbFilterOpr.EndsWith]: {
        name: DbFilterOpr.EndsWith,
        label: 'Ends With',
        order: 11,
        valueType: dbFilterValueType.One,
        dataType: [],
    },
    [DbFilterOpr.Contains]: {
        name: DbFilterOpr.Contains,
        label: 'Contains',
        order: 12,
        valueType: dbFilterValueType.One,
        dataType: [DbDataType.String],
    },
    [DbFilterOpr.ToDay]: {
        name: DbFilterOpr.ToDay,
        label: 'Today',
        order: 13,
        valueType: dbFilterValueType.None,
        dataType: [DbDataType.Date, DbDataType.Datetime],
    },
}