import { DB_FILTER_OPR_META } from '../constants/db-filter-opr-meta.constants';

type DbFilterOpr = keyof typeof DB_FILTER_OPR_META;

export interface FilterParsed {
  not?: boolean;
  and?: boolean;
  field?: Partial<Record<DbFilterOpr, Record<string, string>>>;
}

export function parseFilterFromQuery(query: Record<string, any>): FilterParsed {
  const filter: FilterParsed = {
    not: false,
    and: false,
    field: {},
  };

  if (query['filter.not'] !== undefined) {
    filter.not = query['filter.not'] === 'true';
  }

  if (query['filter.and'] !== undefined) {
    filter.and = query['filter.and'] === 'true';
  }

  const validOperators = Object.keys(DB_FILTER_OPR_META);

  Object.entries(query).forEach(([key, value]) => {
    if (key.startsWith('filter.field.')) {
      const parts = key.split('.');
      if (parts.length === 4) {
        const opr = parts[2];
        const fieldName = parts[3];

        if (validOperators.includes(opr)) {
          // Pastikan field[opr] ada dulu
          if (!filter.field) {
            filter.field = {};
          }

          if (!filter.field[opr]) {
            filter.field[opr] = {};
          }

          // TypeScript bisa error di sini tanpa type assertion
          (filter.field[opr] as Record<string, string>)[fieldName] = value;
        }
      }
    }
  });

  return filter;
}
