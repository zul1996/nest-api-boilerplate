// src/common/services/base.service.ts
import { DeepPartial, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseEntity } from '../entities/base.entity';
import { AuditLogEntity } from '../entities/audit-log';
import { ConfigService } from '@nestjs/config';
import { IBaseService } from '../interface/ibase.interface';
import { Injectable } from '@nestjs/common';
import { CrudMetadata } from '../interface/crud-metada.interface';
import { extractCrudMetadata } from '../utils/metadata/extract-crud-metadata.util';
import { applyFilterToQuery, applySortingToQuery } from '../utils/query-utils';
import { FilterParsed } from '../utils/filter-parser.utils';
import {
  PaginationResponse,
  SortInfo,
} from '../interface/pagination-response.interface';
import { FilterParsedDto, PaginationRequestDto } from 'src/dto/searcth.dto';
import { ClassConstructor, plainToInstance } from 'class-transformer';
import { filterDtoFieldsByVisibility } from '../decorators/field-metada.decorator';

@Injectable()
export abstract class BaseService<T extends BaseEntity, TDto extends Object>
  implements IBaseService<T, TDto>
{
  protected abstract dtoClass: ClassConstructor<TDto>;
  protected abstract entityClass: new () => T;

  constructor(
    protected readonly repo: Repository<T>,
    @InjectRepository(AuditLogEntity)
    private readonly auditRepo: Repository<AuditLogEntity>,
    private readonly configService: ConfigService,
  ) {}
  getDtoClass(): ClassConstructor<TDto> {
    return this.dtoClass;
  }

  getDtoClassConstructor(): new () => TDto {
    return this.dtoClass as unknown as new () => TDto;
  }

  getEntityClass(): new () => T {
    return this.entityClass;
  }

  private isAuditEnabled(): boolean {
    const val = this.configService.get<string>('AUDIT_LOG_ENABLED');
    if (typeof val !== 'string') return true;
    return val.toLowerCase() === 'true';
  }

  async create(dto: DeepPartial<T>, username: string): Promise<T> {
    const now = new Date();

    const entity = this.repo.create({
      ...dto,
      createdBy: username,
      createdAt: now,
      updatedBy: username,
      updatedAt: now,
    } as any);

    const saved = await this.repo.save(entity);

    // Tangani kemungkinan saved array atau single entity
    const savedEntity = Array.isArray(saved) ? saved[0] : saved;
    const savedPlain = JSON.parse(JSON.stringify(saved));

    await this.auditRepo.save({
      entityName: this.repo.metadata.name,
      entityId: savedEntity.id,
      action: 'CREATE',
      performedBy: username,
      oldValue: null,
      newValue: savedPlain,
    });

    return savedEntity;
  }

  async update(id: string, dto: DeepPartial<T>, username: string): Promise<T> {
    const oldEntity = await this.repo.findOneOrFail({ where: { id } as any });
    const now = new Date();

    const entity = this.repo.merge(oldEntity, {
      ...dto,
      updatedBy: username,
      updatedAt: now,
    });

    const saved = await this.repo.save(entity);
    const savedPlain = JSON.parse(JSON.stringify(saved));
    const oldPlain = JSON.parse(JSON.stringify(oldEntity));

    await this.auditRepo.save({
      entityName: this.repo.metadata.name,
      entityId: saved.id,
      action: 'UPDATE',
      performedBy: username,
      oldValue: oldPlain,
      newValue: savedPlain,
    });

    return saved;
  }

  getMetadata(): CrudMetadata {
    return extractCrudMetadata(this.getDtoClass(), this.getEntityClass());
  }

  async search(
    request: PaginationRequestDto,
  ): Promise<PaginationResponse<Partial<TDto>>> {
    const filter = normalizeFilter(request.filter);

    const pageNumber = request.page && request.page >= 0 ? request.page : 0;
    const pageSize = request.size && request.size > 0 ? request.size : 10;
    const sort = request.sort ?? '';

    const qb = this.repo.createQueryBuilder('entity');

    applyFilterToQuery(qb, 'entity', filter);

    // Determine sort string
    let sortString = '';
    if (typeof sort === 'string' && sort.trim() !== '') {
      sortString = sort.trim();
    } else if (typeof sort === 'object' && sort.field) {
      const direction = sort.direction === 'DESC' ? 'DESC' : 'ASC';
      sortString = `${sort.field},${direction}`;
    }

    applySortingToQuery(qb, 'entity', sortString);

    qb.skip(pageNumber * pageSize);
    qb.take(pageSize);

    const [entities, totalElements] = await qb.getManyAndCount();

    const dtos = entities.map((entity) =>
      plainToInstance(this.getDtoClassConstructor(), entity, {
        excludeExtraneousValues: true,
      }),
    );

    const filteredDtos = dtos.map((dto) =>
      filterDtoFieldsByVisibility<TDto>(dto, this.getDtoClassConstructor()),
    );

    const totalPages = Math.ceil(totalElements / pageSize);

    // Build sort info
    let sortInfo: SortInfo = {
      empty: true,
      sorted: false,
      unsorted: true,
    };

    if (sortString) {
      const [field, directionRaw] = sortString.split(',');
      const direction = directionRaw?.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

      sortInfo = {
        field: field ?? '',
        direction,
        empty: false,
        sorted: true,
        unsorted: false,
      };
    } else if (typeof sort === 'object' && sort.field) {
      sortInfo = {
        field: sort.field,
        direction: sort.direction === 'DESC' ? 'DESC' : 'ASC',
        empty: false,
        sorted: true,
        unsorted: false,
      };
    }

    // Pagination metadata for response
    const pageable = {
      pageNumber,
      pageSize,
      offset: pageNumber * pageSize,
      paged: true,
      unpaged: false,
      sort: sortInfo,
    };

    return {
      content: filteredDtos,
      pageable,
      totalPages,
      totalElements,
      last: pageNumber + 1 >= totalPages,
      size: pageSize,
      number: pageNumber,
      sort: sortInfo,
      first: pageNumber === 0,
      numberOfElements: filteredDtos.length,
      empty: filteredDtos.length === 0,
    };
  }

  async findOne(id: string): Promise<T> {
    return this.repo.findOneOrFail({ where: { id } as any });
  }

  async delete(id: string, username: string): Promise<void> {
    const entity = await this.repo.findOneOrFail({ where: { id } as any });
    const oldPlain = JSON.parse(JSON.stringify(entity));

    await this.repo.remove(entity);

    await this.auditRepo.save({
      entityName: this.repo.metadata.name,
      entityId: id,
      action: 'DELETE',
      performedBy: username,
      oldValue: oldPlain,
      newValue: null,
    });
  }
}

@Injectable()
export abstract class SimpleBaseService<
  T extends BaseEntity,
  TDto extends Object,
> implements IBaseService<T, TDto>
{
  protected abstract dtoClass: ClassConstructor<TDto>;
  protected abstract entityClass: new () => T;
  constructor(protected readonly repo: Repository<T>) {}

  getDtoClass(): ClassConstructor<TDto> {
    return this.dtoClass;
  }

  getDtoClassConstructor(): new () => TDto {
    return this.dtoClass as unknown as new () => TDto;
  }

  getEntityClass(): new () => T {
    return this.entityClass;
  }

  async create(dto: DeepPartial<T>, username: string): Promise<T> {
    const now = new Date();

    const entity = this.repo.create({
      ...dto,
      createdBy: username,
      createdAt: now,
      updatedBy: username,
      updatedAt: now,
    } as any);

    const saved = await this.repo.save(entity);

    // Tangani kemungkinan saved array atau single entity
    const savedEntity = Array.isArray(saved) ? saved[0] : saved;

    return savedEntity;
  }

  async update(id: string, dto: DeepPartial<T>, username: string): Promise<T> {
    const oldEntity = await this.repo.findOneOrFail({ where: { id } as any });

    const entity = this.repo.merge(oldEntity, {
      ...dto,
      updatedBy: username,
      updatedAt: new Date(),
    });

    const saved = await this.repo.save(entity);
    return saved;
  }

  async findOne(id: string): Promise<T> {
    return this.repo.findOneOrFail({ where: { id } as any });
  }

  async search(
    request: PaginationRequestDto,
  ): Promise<PaginationResponse<Partial<TDto>>> {
    const filter = normalizeFilter(request.filter);

    const pageNumber = request.page && request.page >= 0 ? request.page : 0;
    const pageSize = request.size && request.size > 0 ? request.size : 10;
    const sort = request.sort ?? '';

    const qb = this.repo.createQueryBuilder('entity');

    applyFilterToQuery(qb, 'entity', filter);

    // Determine sort string
    let sortString = '';
    if (typeof sort === 'string' && sort.trim() !== '') {
      sortString = sort.trim();
    } else if (typeof sort === 'object' && sort.field) {
      const direction = sort.direction === 'DESC' ? 'DESC' : 'ASC';
      sortString = `${sort.field},${direction}`;
    }

    applySortingToQuery(qb, 'entity', sortString);

    qb.skip(pageNumber * pageSize);
    qb.take(pageSize);

    const [entities, totalElements] = await qb.getManyAndCount();

    const dtos = entities.map((entity) =>
      plainToInstance(this.getDtoClassConstructor(), entity),
    );

    const filteredDtos = dtos.map((dto) =>
      filterDtoFieldsByVisibility<TDto>(dto, this.getDtoClassConstructor()),
    );

    const totalPages = Math.ceil(totalElements / pageSize);

    // Build sort info
    let sortInfo: SortInfo = {
      empty: true,
      sorted: false,
      unsorted: true,
    };

    if (sortString) {
      const [field, directionRaw] = sortString.split(',');
      const direction = directionRaw?.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

      sortInfo = {
        field: field ?? '',
        direction,
        empty: false,
        sorted: true,
        unsorted: false,
      };
    } else if (typeof sort === 'object' && sort.field) {
      sortInfo = {
        field: sort.field,
        direction: sort.direction === 'DESC' ? 'DESC' : 'ASC',
        empty: false,
        sorted: true,
        unsorted: false,
      };
    }

    // Pagination metadata for response
    const pageable = {
      pageNumber,
      pageSize,
      offset: pageNumber * pageSize,
      paged: true,
      unpaged: false,
      sort: sortInfo,
    };

    return {
      content: filteredDtos,
      pageable,
      totalPages,
      totalElements,
      last: pageNumber + 1 >= totalPages,
      size: pageSize,
      number: pageNumber,
      sort: sortInfo,
      first: pageNumber === 0,
      numberOfElements: filteredDtos.length,
      empty: filteredDtos.length === 0,
    };
  }

  async delete(id: string, username: string): Promise<void> {
    const entity = await this.repo.findOneOrFail({ where: { id } as any });
    await this.repo.remove(entity);
  }

  // For SimpleBaseService, you may want to throw or return null for getMetadata
  getMetadata(): CrudMetadata {
    return extractCrudMetadata(this.getDtoClass(), this.getEntityClass());
  }
}

export function normalizeFilter(input?: FilterParsedDto): FilterParsed {
  return {
    and: input?.and ?? true,
    not: input?.not ?? false,
    field: input?.field ?? {},
  };
}