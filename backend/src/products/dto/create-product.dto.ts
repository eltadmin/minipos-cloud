import { IsString, IsNumber, IsOptional, IsObject, IsUUID, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({ description: 'Name of the product' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Description of the product', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'Base price of the product' })
  @IsNumber()
  basePrice: number;

  @ApiProperty({ description: 'Prices for different locations', required: false })
  @IsObject()
  @IsOptional()
  locationPrices?: Record<string, number>;

  @ApiProperty({ description: 'Product lookup number for the cash register', required: false })
  @IsNumber()
  @IsOptional()
  PLU?: number;

  @ApiProperty({ description: 'Department ID', required: false })
  @IsUUID()
  @IsOptional()
  departmentId?: string;

  @ApiProperty({ description: 'Product group ID', required: false })
  @IsUUID()
  @IsOptional()
  productGroupId?: string;

  @ApiProperty({ description: 'Tax group ID' })
  @IsUUID()
  taxGroupId: string;

  @ApiProperty({ description: 'Product flags', required: false })
  @IsObject()
  @IsOptional()
  flags?: {
    allowDiscount?: boolean;
    allowNegativePrice?: boolean;
    requireQuantity?: boolean;
    allowFractionalQuantity?: boolean;
    isActive?: boolean;
  };
} 