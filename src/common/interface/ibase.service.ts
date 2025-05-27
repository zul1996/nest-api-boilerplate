import { DeepPartial } from 'typeorm';

export interface IBaseService<T> {
  create(dto: DeepPartial<T>, username: string): Promise<T>;
  update(id: string, dto: DeepPartial<T>, username: string): Promise<T>;
  findOne(id: string): Promise<T>;
  findAll(): Promise<T[]>;
  delete(id: string, username: string): Promise<void>;
}
