import {
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';

export abstract class BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ nullable: true, type: 'varchar' })
  createdBy: string | null;

  @Column({ nullable: true, type: 'varchar' })
  updatedBy: string | null;
}
