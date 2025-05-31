import { ObjectLiteral, SelectQueryBuilder } from 'typeorm';
import { FilterParsed } from './filter-parser.utils';
import { DB_FILTER_OPR_META } from '../constants/db-filter-opr-meta.constants';

/**
 * Apply dynamic filter to TypeORM query builder.
 */
export function applyFilterToQuery<T extends ObjectLiteral>(
  qb: SelectQueryBuilder<T>,
  alias: string,
  filter: FilterParsed,
  paramIndex = { count: 0 }, // untuk parameter unik
): SelectQueryBuilder<T> {
  if (!filter) return qb;

  function buildCondition(f: FilterParsed): {
    clause: string;
    params: Record<string, any>;
  } {
    if (!f.field) {
      return { clause: '', params: {} };
    }

    const parts: string[] = [];
    const params: Record<string, any> = {};
    // pakai and sebagai boolean penentu join kondisi, default OR kalau and = false atau undefined
    const andOr = f.and === true ? 'AND' : 'OR';
    const notPrefix = f.not ? 'NOT ' : '';

    for (const opr in f.field) {
      if (!Object.prototype.hasOwnProperty.call(f.field, opr)) continue;
      const fields = f.field[opr as keyof typeof f.field];
      if (!fields) continue;

      for (const fieldName in fields) {
        if (!Object.prototype.hasOwnProperty.call(fields, fieldName)) continue;

        if (!(opr in DB_FILTER_OPR_META)) continue;

        paramIndex.count++;
        const paramKey = `param_${paramIndex.count}`;
        let condition = '';

        switch (opr) {
          case 'Eq':
            condition = `${notPrefix}${alias}.${fieldName} = :${paramKey}`;
            params[paramKey] = fields[fieldName];
            break;
          case 'Neq':
            condition = `${notPrefix}${alias}.${fieldName} != :${paramKey}`;
            params[paramKey] = fields[fieldName];
            break;
          case 'Contains':
            condition = `${notPrefix}${alias}.${fieldName} LIKE :${paramKey}`;
            params[paramKey] = `%${fields[fieldName]}%`;
            break;
          case 'In':
            condition = `${notPrefix}${alias}.${fieldName} IN (:...${paramKey})`;
            params[paramKey] = Array.isArray(fields[fieldName])
              ? fields[fieldName]
              : (fields[fieldName] as string).split(',');
            break;
          case 'NotIn':
            condition = `${notPrefix}${alias}.${fieldName} NOT IN (:...${paramKey})`;
            params[paramKey] = Array.isArray(fields[fieldName])
              ? fields[fieldName]
              : (fields[fieldName] as string).split(',');
            break;
          default:
            continue;
        }

        parts.push(condition);
      }
    }

    const clauseStr =
      parts.length > 1 ? parts.join(` ${andOr} `) : parts[0] || '';
    return { clause: clauseStr, params };
  }

  const { clause, params } = buildCondition(filter);
  if (clause) {
    qb.andWhere(clause, params);
  }

  return qb;
}
  

/**
 * Apply sorting to TypeORM query builder.
 */
export function applySortingToQuery<T extends ObjectLiteral>(
  qb: SelectQueryBuilder<T>,
  alias: string,
  sort?: string,
): SelectQueryBuilder<T> {
  if (!sort) return qb;

  const [sortField, sortDir] = sort.split(',');
  if (sortField) {
    const direction = sortDir?.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';
    qb.orderBy(`${alias}.${sortField}`, direction);
  }

  return qb;
}
