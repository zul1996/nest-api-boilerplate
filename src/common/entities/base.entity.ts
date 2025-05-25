import { IsOptional } from 'class-validator';
import {
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
} from 'typeorm';

export abstract class BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @IsOptional()
  @Column({ nullable: true, type: 'varchar' })
  createdBy: string | null;

  @IsOptional()
  @Column({ nullable: true, type: 'varchar' })
  updatedBy: string | null;
}
