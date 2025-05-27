// src/common/services/base.service.ts
import { DeepPartial, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseEntity } from '../entities/base.entity';
import { AuditLogEntity } from '../entities/audit-log';
import { ConfigService } from '@nestjs/config';
import { IBaseService } from '../interface/ibase.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export abstract class BaseService<T extends BaseEntity>
  implements IBaseService<T>
{
  constructor(
    protected readonly repo: Repository<T>,
    @InjectRepository(AuditLogEntity)
    private readonly auditRepo: Repository<AuditLogEntity>,
    private readonly configService: ConfigService,
  ) {}

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

  async findAll(): Promise<T[]> {
    return this.repo.find();
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
export class SimpleBaseService<T extends BaseEntity>
  implements IBaseService<T>
{
  constructor(protected readonly repo: Repository<T>) {}

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

  async findAll(): Promise<T[]> {
    return this.repo.find();
  }

  async delete(id: string, username: string): Promise<void> {
    const entity = await this.repo.findOneOrFail({ where: { id } as any });
    await this.repo.remove(entity);
  }
}