// src/modules/product/entities/product.entity.ts
import { BaseEntity } from 'src/common/entities/base.entity';
import { Column, Entity } from 'typeorm';


@Entity('products')
export class ProductEntity extends BaseEntity {
  @Column()
  name: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column({ nullable: true })
  description?: string;

  @Column({ nullable: true })
  flagAKtif?: number ;
}


