import { DB_FILTER_OPR_META } from "../constants/db-filter-opr-meta.constants";
import { DbDataType, DbFilterOpr } from "../../form-meta/metada.enum";

export function oprForDataType(dataType: DbDataType): DbFilterOpr[] { 
    return Object.values(DbFilterOpr).filter((opr) => {
        return DB_FILTER_OPR_META[opr].dataType.includes(dataType);
    })
}