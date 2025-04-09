import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { Product } from './product.entity';
import { Account } from '../../accounts/entities/account.entity';

export enum BarcodeType {
  EAN13 = 'ean13',
  EAN8 = 'ean8',
  UPC = 'upc',
  QR = 'qr',
  CUSTOM = 'custom',
}

@Entity('barcodes')
export class Barcode extends BaseEntity {
  @Column()
  code: string;

  @Column({
    type: 'enum',
    enum: BarcodeType,
    default: BarcodeType.EAN13,
  })
  type: BarcodeType;

  @Column({ type: 'uuid' })
  productId: string;

  @ManyToOne(() => Product, product => product.barcodes)
  @JoinColumn({ name: 'productId' })
  product: Product;

  @Column({ type: 'uuid' })
  accountId: string;

  @ManyToOne(() => Account)
  @JoinColumn({ name: 'accountId' })
  account: Account;

  @Column({ type: 'int', default: 0 })
  version: number; // For tracking changes for syncing
} 