import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';

import { TipoDocuentoService } from './tipo_docuento.service';
import { CreateTipoDocuentoDto } from './dto/create-tipo_docuento.dto';
import { UpdateTipoDocuentoDto } from './dto/update-tipo_docuento.dto';
import { Auth } from '../usuarios/decorators/auth.decorator';
import { ValidRoles } from 'src/usuarios/interfaces';
import { PaginationTipodocuentoDto } from './dto/pagination-tipo_docuento.dto';

@Controller('tipo-documento')
export class TipoDocuentoController {
  constructor(private readonly tipoDocuentoService: TipoDocuentoService) {}


  @Post('Crear')
  create(@Body() createTipoDocuentoDto: CreateTipoDocuentoDto) {
    return this.tipoDocuentoService.create(createTipoDocuentoDto);
  }

  @Get('Obtener')
  @Auth(ValidRoles.superUser )
  findAll(@Query() pagination: PaginationTipodocuentoDto) {
    return this.tipoDocuentoService.findAll(pagination);
  }

  @Get('/Obtener-uno/:id')
  @Auth(ValidRoles.superUser )
  findOne(@Param('id') id: string) {
    return this.tipoDocuentoService.findOne(id);
  }

  @Patch('/Actualizar/:id')
  @Auth(ValidRoles.superUser )
  update(@Param('id') id: string, @Body() updateTipoDocuentoDto: UpdateTipoDocuentoDto) {
    return this.tipoDocuentoService.update(id, updateTipoDocuentoDto);
  }

  @Delete('/Eliminar/:id')
  @Auth(ValidRoles.superUser )
  actualizarEstado(@Param('id') id: string) {
    return this.tipoDocuentoService.actualizarEstado(id);
  }

}