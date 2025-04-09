import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { Account } from '../../accounts/entities/account.entity';

@Entity('payment_types')
export class PaymentType extends BaseEntity {
  @Column()
  name: string;

  @Column({ type: 'int' })
  code: number; // Code used on the cash register

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'uuid' })
  accountId: string;

  @ManyToOne(() => Account)
  @JoinColumn({ name: 'accountId' })
  account: Account;

  @Column({ type: 'int', default: 0 })
  version: number; // For tracking changes for syncing
} 