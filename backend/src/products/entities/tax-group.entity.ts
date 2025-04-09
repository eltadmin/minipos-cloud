import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { Account } from '../../accounts/entities/account.entity';

@Entity('tax_groups')
export class TaxGroup extends BaseEntity {
  @Column()
  name: string;

  @Column()
  code: string; // Code used on the cash register

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  rate: number; // Tax rate in percentage

  @Column({ type: 'uuid' })
  accountId: string;

  @ManyToOne(() => Account)
  @JoinColumn({ name: 'accountId' })
  account: Account;

  @Column({ type: 'int', default: 0 })
  version: number; // For tracking changes for syncing
} 