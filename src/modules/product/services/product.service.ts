import { Injectable } from '@nestjs/common';
import { SimpleBaseService } from 'src/common/services/base.service';
import { ProductEntity } from '../entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';


@Injectable()
export class ProductService extends SimpleBaseService<ProductEntity> {
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
