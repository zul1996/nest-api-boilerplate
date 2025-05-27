import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ProductEntity } from "./entities/product.entity";
import { ProductController, ProductCustomController } from "./controllers/product.controller";
import { ProductService } from "./services/product.service";
import { JwtModule } from "@nestjs/jwt";
import { PRODUCT_SERVICE } from "./constants/product.constant";

@Module({
  imports: [TypeOrmModule.forFeature([ProductEntity]), JwtModule],
  controllers: [ProductController, ProductCustomController],
  providers: [
    ProductService,
    {
      provide: PRODUCT_SERVICE,
      useExisting: ProductService,
    },
  ],
  exports: [PRODUCT_SERVICE],
})
export class ProductModule {}
