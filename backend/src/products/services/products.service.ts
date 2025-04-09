import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../entities/product.entity';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async findAll(accountId: string, query: any) {
    const { page = 1, limit = 50, search, departmentId, productGroupId } = query;
    const skip = (page - 1) * limit;

    const queryBuilder = this.productRepository
      .createQueryBuilder('product')
      .where('product.accountId = :accountId', { accountId })
      .take(limit)
      .skip(skip);

    if (search) {
      queryBuilder.andWhere(
        '(product.name ILIKE :search OR product.description ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    if (departmentId) {
      queryBuilder.andWhere('product.departmentId = :departmentId', { departmentId });
    }

    if (productGroupId) {
      queryBuilder.andWhere('product.productGroupId = :productGroupId', { productGroupId });
    }

    const [items, total] = await queryBuilder.getManyAndCount();

    return {
      items,
      meta: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(accountId: string, id: string) {
    const product = await this.productRepository.findOne({
      where: { id, accountId },
      relations: ['department', 'productGroup', 'taxGroup', 'barcodes'],
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return product;
  }

  async create(accountId: string, createProductDto: CreateProductDto) {
    const product = this.productRepository.create({
      ...createProductDto,
      accountId,
    });

    // Increment the version number for syncing
    product.version = 1;

    return this.productRepository.save(product);
  }

  async update(accountId: string, id: string, updateProductDto: UpdateProductDto) {
    const product = await this.findOne(accountId, id);

    // Increment the version number for syncing
    product.version += 1;

    Object.assign(product, updateProductDto);

    return this.productRepository.save(product);
  }

  async remove(accountId: string, id: string) {
    const product = await this.findOne(accountId, id);
    return this.productRepository.softRemove(product);
  }
} 