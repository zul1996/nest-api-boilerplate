import { Controller, Param, Post, UseGuards } from '@nestjs/common';
import { createBaseControllerDi } from 'src/common/factories/base-controller.factory';
import { CurrentUser } from 'src/modules/auth/decorators/current-user.decorator';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { PRODUCT_SERVICE } from '../constants/product.constant';
import { ProductDto } from '../dto/product.dto';
import { ProductEntity } from '../entities/product.entity';
import { ProductService } from '../services/product.service';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';


export const ProductController = createBaseControllerDi<ProductEntity, ProductDto>(
  'products',
  ProductDto, // misal DTO-nya ProductDto (kelas DTO yang sudah dibuat)
  PRODUCT_SERVICE, // token provider service
  ProductEntity
);

@ApiTags('products')
@Controller('products')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ProductCustomController {
  constructor(private readonly productService: ProductService) {}

  @ApiBody({ type: ProductDto })
  @Post(':id/approve')
  async approve(
  @Param('id') id: string,
    @CurrentUser() user: { username: string },
  ) {
    return this.productService.approveProduct(id, user.username);
  }
}
