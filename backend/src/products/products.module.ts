import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsController } from './controllers/products.controller';
import { ProductsService } from './services/products.service';
import { Product } from './entities/product.entity';
import { Department } from './entities/department.entity';
import { Barcode } from './entities/barcode.entity';
import { TaxGroup } from './entities/tax-group.entity';
import { ProductGroup } from './entities/product-group.entity';
import { Operator } from './entities/operator.entity';
import { Customer } from './entities/customer.entity';
import { PaymentType } from './entities/payment-type.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Product,
      Department,
      Barcode,
      TaxGroup,
      ProductGroup,
      Operator,
      Customer,
      PaymentType,
    ]),
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [ProductsService],
})
export class ProductsModule {} 