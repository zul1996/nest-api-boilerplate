import { DeepPartial } from "typeorm";
import { BaseEntity } from "../entities/base.entity";
import { IBaseService } from "../interface/ibase.interface";
import { CurrentUser } from "src/modules/auth/decorators/current-user.decorator";
import { Body, Delete, Get, Param, Post, Put } from "@nestjs/common";

export class BaseController<T extends BaseEntity,TDto> {
  constructor(protected readonly baseService: IBaseService<T, TDto>) {}

  @Post()
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

  @Delete(':id')
  async delete(
    @Param('id') id: string,
    @CurrentUser() user: { username: string },
  ) {
    return this.baseService.delete(id, user.username);
  }

  @Get('metadata')
  async getMetadata() {
    return this.baseService.getMetadata();
  }
}
