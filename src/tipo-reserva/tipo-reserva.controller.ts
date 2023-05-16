import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { TipoReservaService } from './tipo-reserva.service';
import { CreateTipoReservaDto } from './dto/create-tipo-reserva.dto';
import { UpdateTipoReservaDto } from './dto/update-tipo-reserva.dto';
import { Auth, GetUser } from 'src/usuarios/decorators';
import { ValidRoles } from 'src/usuarios/interfaces';
import { Usuario } from 'src/entities';
import { PaginationTiporeservaDto } from './dto/pagination-tipo-reserva.dto';

@Controller('tipo-reserva')
export class TipoReservaController {
  constructor(private readonly tipoReservaService: TipoReservaService) {}

  @Post('Crear')
  @Auth( ValidRoles.admin, ValidRoles.superUser )
  create(@Body() createTipoReservaDto: CreateTipoReservaDto, @GetUser() user: Usuario) {
    return this.tipoReservaService.create(createTipoReservaDto, user);
  }

  @Get("Obtener")
  @Auth(ValidRoles.admin, ValidRoles.superUser )
  findAll(@Query() pagination: PaginationTiporeservaDto) {
    return this.tipoReservaService.findAll(pagination);
  }

  @Get('/Obtener-una/:id')
  @Auth(ValidRoles.admin, ValidRoles.superUser )
  findOne(@Param('id') id: string) {
    return this.tipoReservaService.findOne(id);
  }

  @Patch('/Actualizar/:id')
  @Auth(ValidRoles.admin, ValidRoles.superUser )
  update(@Param('id') id: string, @Body() updateTipoReservaDto: UpdateTipoReservaDto) {
    return this.tipoReservaService.update(id, updateTipoReservaDto);
  }

  @Delete('/Eliminar/:id')
  @Auth(ValidRoles.admin, ValidRoles.superUser )
  actualizarEstado(@Param('id') id: string) {
    return this.tipoReservaService.actualizarEstado(id);
  }
}
