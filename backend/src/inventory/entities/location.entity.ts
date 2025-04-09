import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { Account } from '../../accounts/entities/account.entity';
import { StockLevel } from './stock-level.entity';
import { Document } from './document.entity';

@Entity('locations')
export class Location extends BaseEntity {
  @Column()
  name: string;

  @Column({ nullable: true })
  address?: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'uuid' })
  accountId: string;

  @ManyToOne(() => Account)
  @JoinColumn({ name: 'accountId' })
  account: Account;

  @OneToMany(() => StockLevel, stockLevel => stockLevel.location)
  stockLevels: StockLevel[];

  @OneToMany(() => Document, document => document.location)
  documents: Document[];
} 