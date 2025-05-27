import {
  Controller,
  Post,
  Put,
  Get,
  Delete,
  Body,
  Param,
  Inject,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBody, ApiBearerAuth } from '@nestjs/swagger'; // ⬅️ Import interface-nya
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { DeepPartial } from 'typeorm';
import { IBaseService } from '../interface/ibase.service';
import { CurrentUser } from 'src/modules/auth/decorators/current-user.decorator';

export function createBaseControllerDi<T, D>(
  prefix: string,
  dtoClass: new () => D,
  serviceToken: string,
) {
  @ApiTags(prefix)
  @Controller(prefix)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  class GenericBaseController {
    constructor(
      @Inject(serviceToken)
      public readonly baseService: IBaseService<T>, // ✅ pakai interface langsung
    ) {}

    @Post()
    @ApiBody({ type: dtoClass })
    async create(
      @Body() dto: DeepPartial<T>,
      @CurrentUser() user: { username: string },
    ) {
      return this.baseService.create(dto, user.username);
    }

    @Put(':id')
    async update(
      @Param('id') id: string,
      @Body() dto: DeepPartial<T>,
      @CurrentUser() user: { username: string },
    ) {
      return this.baseService.update(id, dto, user.username);
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
      return this.baseService.findOne(id);
    }

    @Get()
    async findAll() {
      return this.baseService.findAll();
    }

    @Delete(':id')
    async delete(
      @Param('id') id: string,
      @CurrentUser() user: { username: string },
    ) {
      return this.baseService.delete(id, user.username);
    }
  }

  return GenericBaseController;
}
