import { Injectable } from '@nestjs/common';
import { SimpleBaseService } from 'src/common/services/base.service';
import { ProductEntity } from '../entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductDto } from '../dto/product.dto';
import { ClassConstructor } from 'class-transformer';


@Injectable()
export class ProductService extends SimpleBaseService<
  ProductEntity,
  ProductDto
> {
  protected dtoClass = ProductDto;
  protected entityClass = ProductEntity;

  constructor(
    @InjectRepository(ProductEntity) // <-- injeksi dengan decorator ini
    protected readonly repo: Repository<ProductEntity>,
  ) {
    super(repo);
  }

  async approveProduct(id: string, username: string): Promise<ProductEntity> {
    const product = await this.findOne(id);
    if (!product) throw new Error('Product not found');
    product.flagAKtif = 1;
    await this.repo.save(product);
    return product;
  }
}
