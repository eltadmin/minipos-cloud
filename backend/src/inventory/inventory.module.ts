import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InventoryService } from './services/inventory.service';
import { InventoryController } from './controllers/inventory.controller';
import { StockMovement } from './entities/stock-movement.entity';
import { StockLevel } from './entities/stock-level.entity';
import { Location } from './entities/location.entity';
import { Document } from './entities/document.entity';
import { DocumentItem } from './entities/document-item.entity';
import { ProductsModule } from '../products/products.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      StockMovement,
      StockLevel,
      Location,
      Document,
      DocumentItem,
    ]),
    ProductsModule,
  ],
  controllers: [InventoryController],
  providers: [InventoryService],
  exports: [InventoryService],
})
export class InventoryModule {} 