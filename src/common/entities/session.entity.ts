import { Entity, Column, PrimaryColumn, CreateDateColumn } from 'typeorm';

@Entity('sessions')
export class SessionEntity {
  @PrimaryColumn()
  sessionId: string;

  @Column()
  userId: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @Column({ type: 'timestamp' })
  expiredAt: Date;
}
