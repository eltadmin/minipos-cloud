import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CashRegister } from './entities/cash-register.entity';
import { CashRegisterCommunicationService } from './services/communication.service';
import { CashRegisterCommunicationController } from './controllers/communication.controller';
import { CashRegisterAuthGuard } from './guards/cash-register-auth.guard';

@Module({
  imports: [TypeOrmModule.forFeature([CashRegister])],
  providers: [CashRegisterCommunicationService, CashRegisterAuthGuard],
  controllers: [CashRegisterCommunicationController],
  exports: [CashRegisterCommunicationService],
})
export class CashRegistersModule {} 