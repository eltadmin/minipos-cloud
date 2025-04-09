import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { Department } from './department.entity';
import { ProductGroup } from './product-group.entity';
import { TaxGroup } from './tax-group.entity';
import { Account } from '../../accounts/entities/account.entity';
import { Barcode } from './barcode.entity';

@Entity('products')
export class Product extends BaseEntity {
  @Column()
  name: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  basePrice: number;

  @Column({ type: 'jsonb', default: {} })
  locationPrices: Record<string, number>; // Maps locationId to price

  @Column({ default: 0 })
  PLU: number; // Product Lookup number for the cash register

  @Column({ type: 'uuid' })
  accountId: string;

  @ManyToOne(() => Account)
  @JoinColumn({ name: 'accountId' })
  account: Account;

  @Column({ type: 'uuid', nullable: true })
  departmentId?: string;

  @ManyToOne(() => Department, { nullable: true })
  @JoinColumn({ name: 'departmentId' })
  department?: Department;

  @Column({ type: 'uuid', nullable: true })
  productGroupId?: string;

  @ManyToOne(() => ProductGroup, { nullable: true })
  @JoinColumn({ name: 'productGroupId' })
  productGroup?: ProductGroup;

  @Column({ type: 'uuid' })
  taxGroupId: string;

  @ManyToOne(() => TaxGroup)
  @JoinColumn({ name: 'taxGroupId' })
  taxGroup: TaxGroup;

  @OneToMany(() => Barcode, barcode => barcode.product)
  barcodes: Barcode[];

  @Column({ type: 'jsonb', default: {} })
  flags: {
    allowDiscount?: boolean;
    allowNegativePrice?: boolean;
    requireQuantity?: boolean;
    allowFractionalQuantity?: boolean;
    isActive?: boolean;
  };

  @Column({ type: 'int', default: 0 })
  version: number; // For tracking changes for syncing
} 