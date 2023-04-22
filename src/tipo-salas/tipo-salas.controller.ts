import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';

import { TipoSalasService } from './tipo-salas.service';
import { CreateTipoSalaDto } from './dto/create-tipo-sala.dto';
import { UpdateTipoSalaDto } from './dto/update-tipo-sala.dto';
import { PaginationTipoSalaDto } from './dto/Pagination-tipo-sala.dto';
import { Auth, GetUser } from 'src/usuarios/decorators';
import { ValidRoles } from 'src/usuarios/interfaces';
import { Usuario } from 'src/entities';


@Controller('tipo-salas')
export class TipoSalasController {
  constructor(private readonly tipoSalasService: TipoSalasService) {}

  @Post('Crear')
  @Auth( ValidRoles.admin, ValidRoles.superUser )
  create(@Body() createTipoSalaDto: CreateTipoSalaDto, @GetUser() user: Usuario) {
    return this.tipoSalasService.create(createTipoSalaDto, user);
  }

  @Get('Obtener')
  @Auth( ValidRoles.estudiante,ValidRoles.docente, ValidRoles.admin, ValidRoles.superUser )
  findAll(@Query() pagination: PaginationTipoSalaDto) {
    return this.tipoSalasService.findAll(pagination);
  }


  @Get('/Obtener-uno/:id')
  @Auth(ValidRoles.estudiante,ValidRoles.docente, ValidRoles.admin, ValidRoles.superUser )
  findOne(@Param('id') id: string) {
    return this.tipoSalasService.findOne(id);
  }

  @Patch('/Actualizar/:id')
  @Auth( ValidRoles.admin, ValidRoles.superUser )
  update(@Param('id') id: string, @Body() updateTipoSalaDto: UpdateTipoSalaDto) {
    return this.tipoSalasService.update(id, updateTipoSalaDto);
  }
  
  @Delete('/Eliminar/:id')
  @Auth( ValidRoles.admin, ValidRoles.superUser )
  actualizarEstado(@Param('id') id: string) {
    return this.tipoSalasService.actualizarEstado(id);
  }
}
