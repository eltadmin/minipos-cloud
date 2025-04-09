import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { Account } from '../../accounts/entities/account.entity';
import { Location } from './location.entity';
import { DocumentItem } from './document-item.entity';
import { User } from '../../users/entities/user.entity';

export enum DocumentType {
  DELIVERY = 'delivery',
  TRANSFER = 'transfer',
  WRITE_OFF = 'write_off',
  REVISION = 'revision',
  SALE = 'sale',
  RETURN = 'return',
}

export enum DocumentStatus {
  DRAFT = 'draft',
  CONFIRMED = 'confirmed',
  CANCELED = 'canceled',
}

@Entity('documents')
export class Document extends BaseEntity {
  @Column({
    type: 'enum',
    enum: DocumentType,
  })
  type: DocumentType;

  @Column({
    type: 'enum',
    enum: DocumentStatus,
    default: DocumentStatus.DRAFT,
  })
  status: DocumentStatus;

  @Column()
  number: string;

  @Column({ type: 'date' })
  date: Date;

  @Column({ nullable: true })
  notes?: string;

  @Column({ type: 'uuid' })
  locationId: string;

  @ManyToOne(() => Location, location => location.documents)
  @JoinColumn({ name: 'locationId' })
  location: Location;

  @Column({ type: 'uuid', nullable: true })
  targetLocationId?: string;

  @ManyToOne(() => Location, { nullable: true })
  @JoinColumn({ name: 'targetLocationId' })
  targetLocation?: Location;

  @Column({ type: 'uuid' })
  userId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ type: 'uuid' })
  accountId: string;

  @ManyToOne(() => Account)
  @JoinColumn({ name: 'accountId' })
  account: Account;

  @OneToMany(() => DocumentItem, item => item.document, { cascade: true })
  items: DocumentItem[];

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  totalAmount: number;
} 