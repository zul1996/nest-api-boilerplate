import { DeepPartial } from 'typeorm';
import { CrudMetadata } from './crud-metada.interface';
import { FilterParsed } from '../utils/filter-parser.utils';
import { PaginationResponse, SortInfo } from './pagination-response.interface';
import { PaginationRequestDto } from 'src/dto/searcth.dto';

export interface IBaseService<T, TDto> {
  create(dto: DeepPartial<T>, username: string): Promise<T>;
  update(id: string, dto: DeepPartial<T>, username: string): Promise<T>;
  findOne(id: string): Promise<T>;
  search(
    request: PaginationRequestDto,
  ): Promise<PaginationResponse<Partial<TDto>>>;
  delete(id: string, username: string): Promise<void>;

  getMetadata(): CrudMetadata;
}
