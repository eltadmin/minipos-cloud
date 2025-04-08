import { Entity, Column, ManyToMany, JoinTable } from 'typeorm';
import { Exclude } from 'class-transformer';
import { BaseEntity } from '../../common/entities/base.entity';
import { Account } from '../../accounts/entities/account.entity';

export enum UserRole {
  OWNER = 'owner',
  ADMIN = 'admin',
  OPERATOR = 'operator',
  OBSERVER = 'observer',
}

@Entity('users')
export class User extends BaseEntity {
  @Column({ unique: true })
  email: string;

  @Column()
  @Exclude()
  password: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ default: true })
  isActive: boolean;

  @ManyToMany(() => Account, account => account.users)
  @JoinTable({
    name: 'user_accounts',
    joinColumn: {
      name: 'userId',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'accountId',
      referencedColumnName: 'id',
    },
  })
  accounts: Account[];

  @Column({
    type: 'jsonb',
    default: {},
  })
  accountRoles: Record<string, UserRole>; // Maps accountId to role
} 