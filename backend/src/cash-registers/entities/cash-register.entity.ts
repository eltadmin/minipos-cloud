import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { Account } from '../../accounts/entities/account.entity';

export enum CashRegisterStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  DEMO = 'demo',
  SUSPENDED = 'suspended',
}

@Entity('cash_registers')
export class CashRegister extends BaseEntity {
  @Column({ unique: true })
  serialNumber: string;

  @Column({ unique: true })
  fiscalMemoryNumber: string;

  @Column({ unique: true })
  registrationNumber: string; // NAP registration ID

  @Column({
    type: 'enum',
    enum: CashRegisterStatus,
    default: CashRegisterStatus.DEMO,
  })
  status: CashRegisterStatus;

  @Column({ type: 'timestamp', nullable: true })
  subscriptionExpiresAt?: Date;

  @Column({ type: 'timestamp', nullable: true })
  lastSyncAt?: Date;

  @Column({ type: 'varchar', nullable: true })
  firmwareVersion?: string;

  @Column({ type: 'jsonb', default: {} })
  dbVersions: {
    products?: number;
    operators?: number;
    departments?: number;
    clients?: number;
    taxGroups?: number;
  };

  @ManyToOne(() => Account, account => account.cashRegisters)
  @JoinColumn({ name: 'accountId' })
  account: Account;

  @Column({ type: 'uuid' })
  accountId: string;

  @Column({ type: 'jsonb', default: {} })
  settings: {
    syncInterval?: number; // in seconds
    documentCountThreshold?: number;
    allowedFeatures?: string[];
    ipAddress?: string;
    simCardNumber?: string;
  };

  @Column({ type: 'jsonb', default: [] })
  communicationLog: Array<{
    timestamp: Date;
    type: 'connect' | 'disconnect' | 'error' | 'sync';
    message: string;
    details?: Record<string, any>;
  }>;
} 