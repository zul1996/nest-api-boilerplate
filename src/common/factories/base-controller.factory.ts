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
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger'; // ⬅️ Import interface-nya
import { CurrentUser } from 'src/modules/auth/decorators/current-user.decorator';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { DeepPartial } from 'typeorm';
import { extractCrudMetadata } from '../utils/metadata/extract-crud-metadata.util';
import { FilterParsed } from '../utils/filter-parser.utils';
import { SortInfo } from '../interface/pagination-response.interface';
import { PaginationRequestDto } from 'src/dto/searcth.dto';
import { IBaseService } from '../interface/ibase.interface';

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

    @Get('search')
    @ApiQuery({
      name: 'filter',
      required: false,
      description: 'Contoh isi filter: {"field":{"Contains":{"name":"co"}}}',
      schema: {
        type: 'string',
        example: '{"field":{"Contains":{"name":"cooler"}}}',
      },
    })
    @ApiQuery({ name: 'page', required: false, type: Number })
    @ApiQuery({ name: 'size', required: false, type: Number })
    @ApiQuery({ name: 'sort', required: false, type: String })
    async searchGet(@Query() query: any) {
      // Jika filter dikirim sebagai JSON string, parsing dulu
      let filter = {};
      if (query.filter) {
        try {
          filter = JSON.parse(query.filter);
        } catch {
          filter = {};
        }
      }

      const dto: PaginationRequestDto = {
        page: query.page ? Number(query.page) : 0,
        size: query.size ? Number(query.size) : 10,
        sort: query.sort ?? '',
        filter,
      };

      return this.baseService.search(dto);
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
      return this.baseService.findOne(id);
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
