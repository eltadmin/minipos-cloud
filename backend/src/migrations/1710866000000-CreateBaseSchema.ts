import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateBaseSchema1710866000000 implements MigrationInterface {
  name = 'CreateBaseSchema1710866000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create users table
    await queryRunner.query(`
      CREATE TABLE "users" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "email" varchar UNIQUE NOT NULL,
        "password" varchar NOT NULL,
        "firstName" varchar NOT NULL,
        "lastName" varchar NOT NULL,
        "isActive" boolean DEFAULT true,
        "accountRoles" jsonb DEFAULT '{}',
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        "deletedAt" TIMESTAMP
      )
    `);

    // Create accounts table
    await queryRunner.query(`
      CREATE TABLE "accounts" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "name" varchar UNIQUE NOT NULL,
        "schemaName" varchar UNIQUE NOT NULL,
        "description" varchar,
        "isActive" boolean DEFAULT true,
        "serviceTier" integer DEFAULT 1,
        "lastActivityAt" TIMESTAMP,
        "settings" jsonb DEFAULT '{}',
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        "deletedAt" TIMESTAMP
      )
    `);

    // Create cash_registers table
    await queryRunner.query(`
      CREATE TYPE "cash_register_status_enum" AS ENUM ('active', 'inactive', 'demo', 'suspended')
    `);

    await queryRunner.query(`
      CREATE TABLE "cash_registers" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "serialNumber" varchar UNIQUE NOT NULL,
        "fiscalMemoryNumber" varchar UNIQUE NOT NULL,
        "registrationNumber" varchar UNIQUE NOT NULL,
        "status" cash_register_status_enum DEFAULT 'demo',
        "subscriptionExpiresAt" TIMESTAMP,
        "lastSyncAt" TIMESTAMP,
        "firmwareVersion" varchar,
        "dbVersions" jsonb DEFAULT '{}',
        "accountId" uuid NOT NULL REFERENCES accounts(id),
        "settings" jsonb DEFAULT '{}',
        "communicationLog" jsonb DEFAULT '[]',
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        "deletedAt" TIMESTAMP
      )
    `);

    // Create user_accounts junction table
    await queryRunner.query(`
      CREATE TABLE "user_accounts" (
        "userId" uuid REFERENCES users(id),
        "accountId" uuid REFERENCES accounts(id),
        PRIMARY KEY ("userId", "accountId")
      )
    `);

    // Create indexes
    await queryRunner.query(`
      CREATE INDEX "IDX_users_email" ON "users"("email") WHERE "deletedAt" IS NULL;
      CREATE INDEX "IDX_accounts_name" ON "accounts"("name") WHERE "deletedAt" IS NULL;
      CREATE INDEX "IDX_cash_registers_serial" ON "cash_registers"("serialNumber") WHERE "deletedAt" IS NULL;
      CREATE INDEX "IDX_cash_registers_account" ON "cash_registers"("accountId") WHERE "deletedAt" IS NULL;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop indexes
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_cash_registers_account"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_cash_registers_serial"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_accounts_name"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_users_email"`);

    // Drop tables
    await queryRunner.query(`DROP TABLE IF EXISTS "user_accounts"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "cash_registers"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "cash_register_status_enum"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "accounts"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "users"`);
  }
} 