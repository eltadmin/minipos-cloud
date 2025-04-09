import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { Account } from '../../accounts/entities/account.entity';

@Entity('operators')
export class Operator extends BaseEntity {
  @Column()
  name: string;

  @Column({ length: 4 })
  code: string; // Operator code on the cash register

  @Column({ nullable: true })
  password?: string; // Password for the operator on cash register

  @Column({ type: 'jsonb', default: {} })
  locationAccess: Record<string, boolean>; // Maps locationId to access

  @Column({ type: 'uuid' })
  accountId: string;

  @ManyToOne(() => Account)
  @JoinColumn({ name: 'accountId' })
  account: Account;

  @Column({ type: 'int', default: 0 })
  version: number; // For tracking changes for syncing
} 