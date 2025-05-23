import { BaseEntity } from 'src/common/entities/base.entity';
import { Column, Entity } from 'typeorm';


@Entity('users')
export class Users extends BaseEntity {
  @Column()
  username: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  fullName?: string;

  @Column({ nullable: true })
  email?: string;

  @Column({ nullable: true })
  phoneNumber?: string;

  @Column({ nullable: true })
  roleUser?: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: false })
  accountExpired: boolean;

  @Column({ default: false })
  accountLocked: boolean;

  @Column({ default: false })
  credentialsExpired: boolean;

  @Column({ default: true })
  enabled: boolean;

  @Column({ type: 'timestamp', nullable: true })
  lastLoginSuccessTs?: Date;

  @Column({ type: 'timestamp', nullable: true })
  lastLoginFailedTs?: Date;

  @Column({ default: 0 })
  loginFailCount: number;

  @Column({ default: 0 })
  tokenFailCount: number;

  @Column({ type: 'timestamp', nullable: true })
  lastTokenFailTs?: Date;

  @Column({ default: false })
  mustChangePasswordFlag: boolean;

  @Column({ type: 'timestamp', nullable: true })
  lastChangePasswordTs?: Date;
}
