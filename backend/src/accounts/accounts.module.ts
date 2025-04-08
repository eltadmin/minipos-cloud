import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      // Add account entities here when they are created
    ]),
  ],
  controllers: [],
  providers: [],
  exports: [],
})
export class AccountsModule {} 