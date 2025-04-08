import { Entity, Column, ManyToMany, OneToMany } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { User } from '../../users/entities/user.entity';
import { CashRegister } from '../../cash-registers/entities/cash-register.entity';

@Entity('accounts')
export class Account extends BaseEntity {
  @Column({ unique: true })
  name: string;

  @Column({ unique: true })
  schemaName: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'int', default: 1 })
  serviceTier: number; // 1: Basic, 2: Standard, 3: Advanced

  @ManyToMany(() => User, user => user.accounts)
  users: User[];

  @OneToMany(() => CashRegister, cashRegister => cashRegister.account)
  cashRegisters: CashRegister[];

  // Metadata for account cleanup
  @Column({ type: 'timestamp', nullable: true })
  lastActivityAt?: Date;

  @Column({ type: 'jsonb', default: {} })
  settings: {
    allowedIpAddresses?: string[];
    autoCleanupDays?: number;
    defaultCurrency?: string;
    timeZone?: string;
  };
} 