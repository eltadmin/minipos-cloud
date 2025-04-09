import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { Account } from '../../accounts/entities/account.entity';

@Entity('product_groups')
export class ProductGroup extends BaseEntity {
  @Column()
  name: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ type: 'uuid' })
  accountId: string;

  @ManyToOne(() => Account)
  @JoinColumn({ name: 'accountId' })
  account: Account;

  @Column({ type: 'uuid', nullable: true })
  parentId?: string;

  @ManyToOne(() => ProductGroup, { nullable: true })
  @JoinColumn({ name: 'parentId' })
  parent?: ProductGroup;

  @OneToMany(() => ProductGroup, group => group.parent)
  children: ProductGroup[];

  @Column({ type: 'int', default: 0 })
  groupNumber: number; // Number used on the cash register

  @Column({ type: 'int', default: 0 })
  version: number; // For tracking changes for syncing
} 