// common/entities/audit-log.entity.ts
import {
    Column,
    CreateDateColumn,
    Entity
} from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity('audit_logs')
export class AuditLogEntity extends BaseEntity {

  @Column()
  entityName: string;

  @Column()
  entityId: string;

  @Column({ type: 'varchar' })
  action: 'CREATE' | 'UPDATE' | 'DELETE';

  @Column({ nullable: true })
  performedBy: string | null;

  @Column({ type: 'jsonb', nullable: true })
  oldValue?: any;

  @Column({ type: 'jsonb', nullable: true })
  newValue?: any;

  @CreateDateColumn({ name: 'timestamp' })
  timestamp: Date;
}
