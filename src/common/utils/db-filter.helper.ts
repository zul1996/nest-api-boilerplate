import { DB_FILTER_OPR_META } from '../constants/db-filter-opr-meta.constants';
import { DbFilterOpr } from '../enums/metada.enum';
import { DbFilterOprMeta } from '../types/db-filter-opr-meta.interface';

// Ambil metadata lengkap dari enum DbFilterOpr
// export function getFilterOprMeta(opr: DbFilterOpr): DbFilterOprMeta {
//   return DB_FILTER_OPR_META[opr];
// }

export function getFilterOprMeta(ops: DbFilterOpr[]): DbFilterOprMeta[] {
  return ops.map((op) => DB_FILTER_OPR_META[op]);
}
