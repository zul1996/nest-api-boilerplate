import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger'; // ⬅️ Import interface-nya
import { CurrentUser } from 'src/modules/auth/decorators/current-user.decorator';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { DeepPartial } from 'typeorm';
import { IBaseService } from '../interface/ibase.service';
import { extractCrudMetadata } from '../utils/metadata/extract-crud-metadata.util';
import { FilterParsed } from '../utils/filter-parser.utils';
import { SortInfo } from '../interface/pagination-response.interface';
import { PaginationRequestDto } from 'src/dto/searcth.dto';

export function createBaseControllerDi<T, D extends DeepPartial<T>>(
  prefix: string,
  dtoClass: new () => D,
  serviceToken: string,
  entityClass: Function,
) {
  @ApiTags(prefix)
  @Controller(prefix)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  class GenericBaseController {
    constructor(
      @Inject(serviceToken)
      public readonly baseService: IBaseService<T, D>, // ✅ pakai interface langsung
    ) {}

    @Post()
    @ApiBody({ type: dtoClass }) // <- ini dtoClass = CreateUserDto
    async create(
      @Body() dto: D, // <- sesuai DTO
      @CurrentUser() user: { username: string },
    ) {
      return this.baseService.create(dto, user.username);
    }

    @Put(':id')
    @ApiBody({ type: dtoClass })
    async update(
      @Param('id') id: string,
      @Body() dto: DeepPartial<T>,
      @CurrentUser() user: { username: string },
    ) {
      return this.baseService.update(id, dto, user.username);
    }

    @Get('metadata')
    @ApiOperation({
      summary: 'Get dynamic metadata',
    })
    async getMetadata() {
      return extractCrudMetadata(dtoClass, entityClass);
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
      return this.baseService.findOne(id);
    }

    @Post('search')
    @ApiBody({ type: PaginationRequestDto })
    async searchPost(@Body() dto: PaginationRequestDto) {
      return this.baseService.search(dto);
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

function parseSort(sortStr: string): SortInfo {
  if (!sortStr) {
    return { empty: true, sorted: false, unsorted: true };
  }
  const [field, dir] = sortStr.split(',');
  return {
    field,
    direction: dir?.toUpperCase() === 'DESC' ? 'DESC' : 'ASC',
    empty: false,
    sorted: true,
    unsorted: false,
  };
}
