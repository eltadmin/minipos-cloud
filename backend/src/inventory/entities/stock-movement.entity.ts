import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { Account } from '../../accounts/entities/account.entity';
import { Product } from '../../products/entities/product.entity';
import { Location } from './location.entity';
import { Document } from './document.entity';
import { DocumentItem } from './document-item.entity';

export enum MovementType {
  IN = 'in',
  OUT = 'out',
  ADJUSTMENT = 'adjustment',
}

@Entity('stock_movements')
export class StockMovement extends BaseEntity {
  @Column({
    type: 'enum',
    enum: MovementType,
  })
  type: MovementType;

  @Column({ type: 'uuid' })
  productId: string;

  @ManyToOne(() => Product)
  @JoinColumn({ name: 'productId' })
  product: Product;

  @Column({ type: 'uuid' })
  locationId: string;

  @ManyToOne(() => Location)
  @JoinColumn({ name: 'locationId' })
  location: Location;

  @Column({ type: 'decimal', precision: 10, scale: 3 })
  quantity: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  unitPrice?: number;

  @Column({ type: 'uuid', nullable: true })
  documentId?: string;

  @ManyToOne(() => Document, { nullable: true })
  @JoinColumn({ name: 'documentId' })
  document?: Document;

  @Column({ type: 'uuid', nullable: true })
  documentItemId?: string;

  @ManyToOne(() => DocumentItem, { nullable: true })
  @JoinColumn({ name: 'documentItemId' })
  documentItem?: DocumentItem;

  @Column({ type: 'uuid' })
  accountId: string;

  @ManyToOne(() => Account)
  @JoinColumn({ name: 'accountId' })
  account: Account;

  @Column({ nullable: true })
  notes?: string;
} 